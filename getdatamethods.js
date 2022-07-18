//begin blockly ##########################################################################################################
var msadminCore = undefined,
	blocklyLogicXml = null,
	blocklyTypesList = [],
	blocklyDDVars = {},
	messengers_devs = {},
	sonos_players = {},
	sonos_playlists = {},

	blocklyGetItemsWithFullPath = function (type) {
		var select = 'item[addr][name]',
			i, selects = [],
			items;
		if (type != undefined) {
			if ($.isArray(type)) {
				for (i = 0; i < type.length; i++) {
					if($.isArray(type[i]))
					selects.push(select + '[type="' + type[i][0] + '"][sub-type="'+ type[i][1] + '"]');
				else
					selects.push(select + '[type="' + type[i] + '"]');
				}
				select = selects.join(", ");
			} else select += '[type="' + type + '"]';
		}
		items = blocklyLogicXml.find(select);
		if (items.length > 0) return items
			.map(function () {
				/*
				var item = $(this),
				parents = item.parents('area')
					.map(function() {
						return $(this).attr('name');
					})
					.get()
					.reverse()
					.join("/");
					
				if(parents != "") parents = '/'+parents+'/';
				return [[(parents+item.attr('name')+'('+item.attr('addr')+')'), item.attr('addr')]];
				*/

				var item = $(this);
				return [
					[(item.attr('name') + '(' + item.attr('addr') + ')'), item.attr('addr')]
				];

			})
			.get();

		return [
			["No items found", ""]
		];
	},
	blocklyGetDeviceType = function (filter) {
		var type = blocklyLogicXml.find(filter)[0];
		if (type) {
			type = type.outerHTML;
			type = type.substring(type.search(' type=') + 7);
			type = type.substring(0, type.search('"'));
		} else {
			type = '';
		}

		return type;
	},
	blocklyDeviceOptionsFromBlock = function (block, filter) {
		var itemType = block.getFieldValue('DEVICETYPE'),
			options;
		if ($.isArray(filter) && filter.length > 0) itemType = filter;
		options = blocklyGetItemsWithFullPath(itemType);
		if (block.type == 'security_control'
		|| this.type == 'imitation'
		|| this.type == 'related_actions'
		|| this.type == 'moving_music') {
			if (options[0][1] == '')
				return [
					['Nothing', '-1']
				]
			return [
				['Nothing', '-1']
			].concat(options);
		}
		return options;
	},
	blocklyDeviceOptions = function (filter) {
		var itemType = this.getFieldValue('DEVICETYPE'),
			options;
		if ($.isArray(filter) && filter.length > 0) itemType = filter;
		options = blocklyGetItemsWithFullPath(itemType);
		if (this.type == 'security_control'
		|| this.type == 'imitation'
		|| this.type == 'related_actions'
		|| this.type == 'moving_music') {
			if (options[0][1] == '')
				return [
					['Nothing', '-1']
				]
			return [
				['Nothing', '-1']
			].concat(options);
		}
		return options;
	},
	blocklyDeviceOptionsGet = function (filter) {
		var itemType = filter,
			options;
		options = blocklyGetItemsWithFullPath(itemType);
		if (this.type == 'security_control'
		|| this.type == 'imitation'
		|| this.type == 'related_actions'
		|| this.type == 'moving_music') {
			if (options[0][1] == '')
				return [
					['Nothing', '-1']
				]
			return [
				['Nothing', '-1']
			].concat(options);
		}
		return options;
	},
	blocklyRemoveTypesDuplicats = function (typesList) {
		var newTypesList = [];
		var allTypes = [];

		typesList.forEach(element => {
			if (!allTypes.includes(element[0])) {
				allTypes.push(element[0]);
				newTypesList.push(element);
			}
		});

		return newTypesList;
	},
	blocklyDeviceTypeOptions = function (filter) {
		var f = this.getField('DEVICE'),
			options = blocklyGetItemsWithFullPath(this.getFieldValue('DEVICETYPE')),
			typesList = [],
			i, row;
		if (f != null) {
			/*
			var optionTextTmp = options[0][0],
			optionText = optionTextTmp.substr(optionTextTmp.lastIndexOf('/')+1);
			*/

			f.menuGenerator_ = options;
			f.setValue(options[0][1]);
			//f.setText(optionText);
		}

		if ($.isArray(filter) && filter.length > 0) {
			for (i = 0; i < blocklyTypesList.length; i++) {
				row = blocklyTypesList[i];
				if (filter.indexOf(row[0]) > -1) typesList.push(row);
			}
			if (typesList.length < 1) typesList = [
				["No items found", ""]
			];
		} else {
			typesList = blocklyTypesList;
		}

		typesList = blocklyRemoveTypesDuplicats(typesList);

		return typesList;
	},
	blocklyGetExeFiles = function (fieldName) {
		var field = undefined,
			copyname = fieldName + '_Copy',
			resultData = [
				["select item", ""]
			],
			onSuccess = function (bFieldName, res) {
				var options2 = [
					["No items found", ""]
				];
				if (res.result === true && res.data.length > 0) {
					options2 = res.data;
				}
				resultData = options2;
				if (bFieldName != '') blocklyDDVars[bFieldName] = options2;

			},
			options;

		field = this.getField(fieldName);

		if (fieldName in blocklyDDVars) {
			options = Array.from(blocklyDDVars[fieldName]);
			blocklyDDVars[copyname] = Array.from(options);
			delete blocklyDDVars[fieldName];
			return options;
		}



		$.ajax(
			'api/api.php?api=Scripts.getExeFiles', {
				async: true,
				method: 'POST',
				success: onSuccess.bind(this, fieldName),
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});

		if (copyname != undefined &&
			(copyname in blocklyDDVars) &&
			blocklyDDVars[copyname].length > 0 &&
			blocklyDDVars[copyname][0][1] != "") resultData = blocklyDDVars[copyname];

		return resultData;
	},
	blocklyBrowseMediaDevices = function (fieldName, resourceType) {
		var thisBlock = this,
			winContent = msadminCore.tr2tmpl('general_scripts.browsemediafiles'),
			dstField = null;

		if (thisBlock.getField != undefined) dstField = this.getField(fieldName);

		var onSelectDevice = function (field, event) {
			if (field != null && selectedDevice != '') field.setValue(selectedDevice);
		},
			browseMediaDevicesWin = bootbox.dialog({
				title: '<i class="fa fa-music"></i> ' + msadminCore.tr('TXT_MEDIA_FILES'),
				message: winContent,
				size: 'large',
				onEscape: false,
				closeButton: false,
				buttons: {
					confirm: {
						label: msadminCore.tr('TXT_SELECT'),
						className: 'btn-ma btn-select-msfile',
						callback: onSelectDevice.bind(thisBlock, dstField)
					},
					cancel: {
						label: msadminCore.tr('TXT_CANCEL'),
						className: 'btn-default'
					}
				}
			}),
			selectedDevice = "";

		browseMediaDevicesWin.init(function () {
			setTimeout(function (args) {

				$('#media_files_tree').jstree({
					"types": {
						"default": {
							"icon": "fa fa-refresh fa-spin"
						},

					},
					"state": {
						"key": "jstreeScripts",
					},
					"plugins": ["types", "state"],

					"core": {
						'themes': {
							'name': 'proton',
							'responsive': true
						},
						"multiple": false,
						'data': {
							'dataType': 'json',
							'url': "api/api.php?api=Scripts.getUpnpTreeNodes&type=" + args[0],
							'data': function (node) {
								if (node.li_attr != undefined && ('udn' in node.li_attr)) return {
									'id': node.id,
									'udn': node.li_attr.udn,
									'browseId': node.li_attr.browseId
								};

								return {
									'id': node.id
								};
							}
						},
					}
				});

				$('#media_files_tree').on("select_node.jstree",
					function (e, data) {
						selectedDevice = data.node.li_attr.url;
					}
				);


				//upload file to media server ##############################################
				var blocklyField = args[1],
					uploadButton = $('<button/>')
						.addClass('btn btn-ma')
						.prop('disabled', true)
						.text(msadminCore.tr('TXT_PROCESSING') + '...')
						.on('click', function () {
							var $this = $(this),
								data = $this.data();

							$this
								.off('click')
								.html('<i class="fa fa-times"></i> ' + msadminCore.tr('TXT_ABORT'))
								.on('click', function () {
									$this.remove();
									data.abort();

									$('#fileslist').html('');
									$('#mediafile_progress').hide();
								});

							data.submit().always(function () {
								$this.remove();
							});
						}),
					serverUrlTpl = "http://%%ip%%/api/api.php?api=DLNA.uploadRemoteFile";

				$('#mediafileupload').fileupload({
					dataType: 'json',
					autoUpload: false,
					maxFileSize: 40000000, // 40 MB
					maxChunkSize: 1900000, // 1,9 MB
					disableImageResize: /Android(?!.*Chrome)|Opera/
						.test(window.navigator.userAgent),
					previewMaxWidth: 100,
					previewMaxHeight: 100,
					previewCrop: true
				}).on('fileuploadadd', function (e, data) {

					$('#fileslist').html('');
					$('#mediafile_progress').hide();

					if ($.checkEmpty("media_server", msadminCore) ||
						$.checkEmpty("login_name", msadminCore) ||
						$.checkEmpty("login_password", msadminCore)) {
						$('#fileslist').html('');
						return false;
					}

					var ip = $('#media_server').val(),
						url = serverUrlTpl.replace(/%%ip%%/gm, ip);
					data.url = url;

					data.context = $('<div/>').appendTo('#fileslist');
					$.each(data.files, function (index, file) {
						var node = $('<p/>')
							.append($('<span/>').text(file.name)),
							node2 = $('<div class="pull-right"/>');

						if (!index) {
							node2
								.append('<br>')
								.append(uploadButton.clone(true).data(data));
							node2.appendTo(node);
						}
						node.appendTo(data.context);
					});

				}).on('fileuploadsubmit', function (e, data) {

					if ($.checkEmpty("media_server", msadminCore) ||
						$.checkEmpty("login_name", msadminCore) ||
						$.checkEmpty("login_password", msadminCore)) {
						$('#fileslist').html('');
						return false;
					}
					var authcode = md5($('#login_name').val() + $('#login_password').val());
					data.formData = {
						authcode: authcode
					};

					$('#mediafile_progress .progress-bar')
						.css(
							'width',
							'0%'
						);
					$('#mediafile_progress').show();

				}).on('fileuploadprocessalways', function (e, data) {
					if (data.context != undefined) {
						var index = data.index,
							file = data.files[index],
							node = $(data.context.children()[index]);
						if (file.preview) {
							node
								.prepend('<br>')
								.prepend(file.preview);
						}
						if (file.error) {
							node
								.append('<br>')
								.append($('<span class="text-danger"/>').text(file.error));
						}
						if (index + 1 === data.files.length) {
							data.context.find('button')
								.html('<i class="fa fa-upload"></i> ' + msadminCore.tr('TXT_UPLOAD_FILE'))
								.prop('disabled', !!data.files.error);
						}
					}
				}).on('fileuploadprogressall', function (e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('#mediafile_progress .progress-bar').css(
						'width',
						progress + '%'
					);
				}).on('fileuploaddone', function (e, data) {
					if ("files" in data.result) {
						$.each(data.result.files, function (index, file) {
							if (file.url) {
								if (blocklyField != null) blocklyField.setValue(file.url);
								$.msalert(msadminCore.tr('TXT_FILE_SY_UPLOADED'));
								$('#fileslist').html('');

								//close window dialog
								browseMediaDevicesWin.modal('hide');
							} else if (file.error) {
								var error = $('<span class="text-danger"/>').text(file.error);
								$(data.context.children()[index])
									.append('<br>')
									.append(error);
							}
						});
					} else {
						var error = $('<span class="text-danger"/>').text(msadminCore.tr('TXT_UPLOAD_ERROR_TO_MEDIA_SERVER'));
						$(data.context.children()[0])
							.append('<br>')
							.append(error);
					}

					$('#mediafile_progress').hide();

				}).on('fileuploadfail', function (e, data) {
					$.each(data.files, function (index) {
						var error = $('<span class="text-danger"/>').text(msadminCore.tr('TXT_UPLOAD_ERROR_TO_MEDIA_SERVER'));
						$(data.context.children()[index])
							.append('<br>')
							.append(error);
					});
				}).prop('disabled', !$.support.fileInput)
					.parent().addClass($.support.fileInput ? undefined : 'disabled');


				var onGetMSSuccess = function (result) {
					var ms = $('#media_server'),
						i, v;
					if (result.result === true && result.data.length > 0) {
						for (i = 0; i < result.data.length; i++) {
							v = result.data[i];
							ms.append('<option value="' + v + '">' + v + '</option>');
						}
					}
					$('.selectpicker').selectpicker('refresh');
				};

				$.ajax(
					'api/api.php?api=Scripts.getPNPMediaServers', {
						async: true,
						method: 'POST',
						success: onGetMSSuccess.bind(),
						error: function (res, textStatus) {

						},
						dataType: 'json'
					});

				$(document).on('shown.bs.tab', 'a[tab-page="mediafiles"]', function (e) {
					var activeTab = $(e.target).attr("href").substr(1);
					if (activeTab == 'upload_mediafile') $('.btn-select-msfile').hide();
					else $('.btn-select-msfile').show();
				});

				//select ###################################################################################
				$('.selectpicker').selectpicker();
				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
					$('.selectpicker').selectpicker('mobile');
				}

				$('.selectpicker').change(
					function () {
						$('.selectpicker').selectpicker('refresh');
					}
				);
				$('.selectpicker').selectpicker('refresh');

			}, 400, [resourceType, dstField]);
		});
	},
	blocklyGetMultiroomServers = function (fieldName) {
		var copyname = fieldName + '_Copy';
		if (fieldName in blocklyDDVars) {
			var options = Array.from(blocklyDDVars[fieldName]);
			blocklyDDVars[copyname] = Array.from(options);
			delete blocklyDDVars[fieldName];
			return options;
		}

		var onSuccess = function (fieldName, res) {
			var options2 = [
				["No items found", ""]
			];
			if (res.result === true && res.data.length > 0) {
				options2 = res.data;
			}
			result = options2;
			blocklyDDVars[fieldName] = options2;
		},
			result = [
				["select server", ""]
			];

		if ((copyname in blocklyDDVars) &&
			blocklyDDVars[copyname].length > 0 &&
			blocklyDDVars[copyname][0][1] != "") result = blocklyDDVars[copyname];

		$.ajax(
			'api/api.php?api=Scripts.getMultiroomServers', {
				async: true,
				method: 'POST',
				success: onSuccess.bind(this, fieldName),
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});

		return result;
	},
	blocklyGetWebhookEventsNames = function () {
		result = [
			['No data', '']
		];
		$.ajax(
			'api/api.php?api=Webhooks.getData', {
				async: false,
				method: 'POST',
				success: function (res) {
					var opts = [],
						i, rec, tmpdata, jsonStr;
					if (res.data.json !== null &&
						res.data.json !== '') {
						jsonStr = Base64.decode(res.data.json);
						if (jsonStr.indexOf(']') > 0) {
							tmpdata = JSON.parse(jsonStr);
							if ($.isArray(tmpdata) && tmpdata.length > 0) {
								for (i = 0; i < tmpdata.length; i++) {
									rec = tmpdata[i];
									opts.push([rec.name, rec.name]);
								}
								result = opts;
							}
						}
					}
				},
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});

		return result;
	},
	blocklyGetSonosPlayers = function (fieldName) {

		if (fieldName in blocklyDDVars) {
			var options = Array.from(blocklyDDVars[fieldName]);
			delete blocklyDDVars[fieldName];
			return options;
		}

		result = [
			['No players', ' ']
		];
			var thisBlock = this,
			onSuccess = function (name, res) {
				var opts = [
					['No players', '']
				],
					thisBlock = this,
					blocklyInput = null;

				if (res.result === true && res.data !== false && res.data.indexOf('}') > 0) {
					sonos_players = JSON.parse(res.data);
					if ('players' in sonos_players) {
						opts = [];
						sonos_players.players.forEach(element => {
							opts.push([element.name, element.id]);
						});
					}
				}


				result = opts;
				blocklyDDVars[name] = opts;

				blocklyInput = thisBlock.getInput(name);
				if (blocklyInput != null && blocklyInput != undefined) {
					blocklyInput.removeField(name);
					blocklyInput.appendField(new Blockly.FieldDropdown(opts), name);
				}

			};

		$.ajax(
			'api/api.php?api=Sonos.blocklyGetSonosPlayers', {
				async: true,
				method: 'POST',
				data: {
					"blocklyGetSonosPlayers": "data"
				},
				success: onSuccess.bind(thisBlock, fieldName),
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});

		return result;
	},
	blocklyGetSonosPlaylists = function (fieldName) {

		result = [
			['No playlists', ' ']
		];
			
		var thisBlock = this;

		if (fieldName in blocklyDDVars) {
			var options = Array.from(blocklyDDVars[fieldName]);
			delete blocklyDDVars[fieldName];
			return options;
		}


		var onSuccess = function (name, res) {
			var opts = [
				['No playlists', '']
			],
				thisBlock = this,
				blocklyInput = null;

			if (res.result && res.data.length > 0 && sonos_players !== res.data) {
				sonos_playlists = JSON.parse(res.data);
				if ("playlists" in sonos_playlists) {
					opts = [];
					sonos_playlists.playlists.forEach(element => {
						opts.push([element.name, element.id]);
					});
				}
			}

			result = opts;
			blocklyDDVars[name] = opts;

			blocklyInput = thisBlock.getInput(name);

			if (blocklyInput != null && blocklyInput != undefined) {
				blocklyInput.removeField(name);
				blocklyInput.appendField(new Blockly.FieldDropdown(opts), name);
			}

		};

		$.ajax(
			'api/api.php?api=Sonos.blocklyGetSonosPlaylists', {
				async: true,
				method: 'POST',
				data: {
					"blocklyGetSonosPlaylists": "data"
				},
				success: onSuccess.bind(thisBlock, fieldName),
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});

		return result;
	},
	blocklyGetMessangerDeviceUrl = function (filter) {
		var type = blocklyLogicXml.find(filter)[0].outerHTML,
			url = type.substring(type.search(' url=') + 6),
			uri = type.substring(type.search(' video-uri=') + 12);
		url = url.substring(0, url.search('"'));
		uri = uri.substring(0, uri.search('"'));
		while (uri.indexOf('&amp') != -1) {
			uri = uri.substring(0, uri.indexOf('&amp') + 1) + uri.substring(uri.indexOf('&amp') + 4);
		}
		while (uri.indexOf(';') != -1) {
			uri = uri.substring(0, uri.indexOf(';')) + uri.substring(uri.indexOf(';') + 1);
		}
		return url + uri;
	},
	blocklyGetMessengerDiviceList = function (fieldName) {
		var messenger = this.getFieldValue('MSGTYPE'),
			onSuccess = function (res) {
				var options2 = [
					{"name":"No items found", "token":""}
				];
				if (res.result === true && res.data.length > 0) {
					options2 = res.data;
				}
				var i = 0;
				options2.forEach(device => {
					options2[i] = [device.name, device.token];
					++i;
				});
				if (messengers_devs[messenger]) {
					if (messengers_devs[messenger].length != options2.length) {
						messengers_devs[messenger] = options2;
						this.getInput(fieldName).removeField(fieldName);
						this.getInput(fieldName)
							.appendField(new Blockly.FieldDropdown(options2), fieldName);
					}
				} else {
					messengers_devs[messenger] = options2;
					this.getInput(fieldName).removeField(fieldName);
					this.getInput(fieldName)
						.appendField(new Blockly.FieldDropdown(options2), fieldName);
				}
			};
		$.ajax(
			'api/api.php?api=Messengers.getDevsList', {
				async: true,
				method: 'POST',
				data: {
					"getDevsList": messenger.toLowerCase()
				},
				success: onSuccess.bind(this),
				error: function (res, textStatus) {
					console.log('An error occurred: ' + textStatus);
				},
				dataType: 'json'
			});
		if (messengers_devs[messenger])
			return messengers_devs[messenger];
		return [
			["No device found", ""]
		];
	};

//end blockly ##########################################################################################################

//blockly generated code filter ########################################################################################

// funcs { name, code }, events { name, code } and vars { name, code }
function __getElements(code) {
	var lines = code.split('\n');
	var breakets = 0;
	var vars = [];
	var isFunc = false;
	var funcs = [];
	var events = [];
	var buff = [];
	var breaketsStarted = false;

	// find elements in code
	lines.forEach(line => {
		// it is a function or an event inner code
		if (breakets > 0 || breaketsStarted) {
			// write line and check for { or }
			if (line.charAt(0) != '\n' && line != "") {
				buff[0] += '\n';
			}

			buff[0] += line;

			if (line.charAt(line.length - 1) != '\n' && line != "") {
				buff[0] += '\n';
			}

			breakets += line.includes('{');
			breakets -= line.includes('}');

			// if end breakets - end of function or event
			if (breakets == 0) {
				if (isFunc) {
					funcs.push({
						name: buff[1],
						code: buff[0]
					});
				} else {
					events.push({
						name: buff[1],
						code: buff[0]
					});
				}

				buff = [];
				breaketsStarted = false;
			}
		} else {
			// if variable
			if ((/^[ui][0-9]{1,2} {0,}\*{0,1} {1,}\w+\[{0,1}\d{0,}\]{0,1} {0,}={0,1} {0,}.{0,}\;$/).test(line)) {
				let isWrite = true;
				// get name
				let name = line.match(/[ui][0-9]{1,2} {1,}(\w+)/)[1];
				//if name not in vars - write
				for (let i = 0; i < vars.length; i++) {
					if (vars[i].name == name) {
						isWrite = false;
						break;
					}
				}

				// write
				if (isWrite) {
					vars.push({
						name: name,
						code: line
					});
				}

				// if function
				// } else if ((/^[voidu]{1,4}\d{0,2} {0,}\*{0,1} {0,}\w+ {0,}\(/).test(line)) {
			} else if ((/^void {1,}\w+ {0,}\(/).test(line)
				|| /^[ui][81632]{1,2} {0,}\*{0,1} {1,}\w+ {0,}\(/.test(line)) {

				breaketsStarted = true;
				breakets += line.includes('{');
				isFunc = true;
				let name = line.match(/^[voidu]{1,4}\d{0,2} {0,}\*{0,1} {1,}(\w+) {0,}\(/)[1];
				buff = [line, name];
				// if event
			} else if ((/[\w-]+\/[\w-\:]+/).test(line) || (/[\w-]+\//).test(line)) {
				breaketsStarted = true;
				breakets += line.includes('{');
				isFunc = false;
				let name = (/[\w-]+\/[\w-\:]+/).test(line)?line.match(/([\w-]+\/[\w-\:]+)/)[1]:line.match(/([\w-]+\/)/)[1];
				buff = [line, name];
			}
		}
	});

	return {
		vars: vars,
		funcs: funcs,
		events: events
	};
}

// true if contains name in code, else false
function __isIncludeFunctionCall(name, code) {
	var regCall = name + ' {0,}\\(';
	var regDelay = 'delayedCall[MsR]{0,3} {0,}\\( {0,}' + name + '[ ,]';
	var regCall = new RegExp(regCall, 'gm');
	var regDelay = new RegExp(regDelay, 'gm');

	return (regCall.test(code) || regDelay.test(code));
}

// check is called function with name from unmarked function
function __isSuccess(name, funcs, callMap) {
	for (let i = 0; i < funcs.length; i++) {
		if (funcs[i].name != name &&
			(funcs[i].code.includes(name + '();') ||
				funcs[i].code.includes('(' + name + ');') ||
				funcs[i].code.includes('(' + name + ', ')) &&
			!callMap[i]) {
			return false;
		}
	}

	return true;
}

// check is called function with name from unmarked function (v2)
function __isSuccess_v2(name, funcs, callMap) {
	for (let i = 0; i < funcs.length; i++) {
		if (funcs[i].name != name &&
			!callMap[i] &&
			funcs[i].code.includes(name)) {

			let lines = funcs[i].code.split('\n');
			for (let j = 1; j < lines.length; j++) {
				if (__isIncludeFunctionCall(name, lines[j])) {
					return false;
				}

			}
		}
	}

	return true;
}

// set functions in order
function __makeFuncsTree(funcs) {
	if (funcs == []) {
		return [];
	}

	var orderedNums = [];
	var callMap = [];

	for (let i = 0; i < funcs.length; i++) {
		callMap.push(false);
	}

	while (callMap.includes(false)) {
		let changes = false;
		// if funtion call is success add it index from funcs to orderedNums
		for (let i = 0; i < funcs.length; i++) {
			if (!callMap[i] && __isSuccess_v2(funcs[i].name, funcs, callMap)) {
				callMap[i] = true;
				orderedNums.push(i);
				changes = true;
			}
		}

		// if two functions call each other throw error
		if (!changes && callMap.includes(false)) {
			let errorFuncs = [];
			for (let i = 0; i < callMap.length; i++) {
				if (!callMap[i]) {
					errorFuncs.push(funcs[i]);
				}
			}

			console.error("ERROR: loop in functions calls! Error functions:");
			console.log(errorFuncs);
			throw "ERROR: loop in functions calls!";
		}
	}

	// write function in reverse order from orderedNums
	var ordered = [];
	for (let i = funcs.length - 1; i >= 0; i--) {
		ordered.push(funcs[orderedNums[i]]);
	}

	return ordered;
}

// generate new code from elements
function __compose(elements) {
	var newCode = '';

	elements.vars.forEach(el => {
		newCode += el.code + '\n';
	});

	newCode += '\n';

	elements.funcs.forEach(el => {
		newCode += '\n' + el.code;
	});

	newCode += '\n';

	elements.events.forEach(el => {
		newCode += '\n' + el.code;
	});

	return newCode;
}

// check for duplicated names
function __includeName(names, name) {
	for (let i = 0; i < names.length; i++) {
		for (let j = 0; j < names[i].length; j++) {
			if (names[i][j] == name) {
				return true;
			}
		}
	}

	return false;
}

// debug merged onInit()
function __checkOnInit(code) {
	var lines = code.split('\n');
	var vars = [];
	var level = 0;

	lines.forEach(line => {
		if (line.includes('{')) {
			++level;
			vars.push([]);
		}

		if (line.includes('}')) {
			--level;
			vars.pop();
		}

		if ((/^[ui][0-9]{1,2} {0,}\*{0,1} {1,}\w+\[{0,1}\d{0,}\]{0,1} {0,}={0,1} {0,}.{0,}\;$/).test(line)) {
			let name = line.match(/^[ui][0-9]{1,2} {0,}\*{0,1} {1,}(\w+)/)
			if (__includeName(vars, name)) {
				let error = 'ERROR: invalid variable name "' + name + '" function!';
				throw error;
			}
			vars[level].push(name);
		}
	});
}

// merge all onInit functions
function __mergeOnInits(funcs) {
	var onInits = [];
	var allFuncs = [];

	// devide onInits and other functions
	funcs.forEach(func => {
		if (func.name == 'onInit') {
			onInits.push(func.code);
		} else {
			allFuncs.push(func);
		}
	});

	// if 1 or 0 onInit - return
	if (onInits.length == 0) {
		return allFuncs;
	} else if (onInits.length == 1) {
		allFuncs.push({
			name: 'onInit',
			code: onInits[0]
		});
		return allFuncs;
	}

	// merge onInits
	var onInitCode = "\nvoid onInit() {\n";
	onInits.forEach(func => {
		let i = 0;
		let j = func.length - 1;

		// find start and end breakets of onInit()
		for (; func.charAt(i) != '{'; i++) { }
		for (; func.charAt(j) != '}'; j--) { }

		onInitCode += '\n' + func.substring(i + 1, j);
	});

	onInitCode += '\n}\n';

	// __checkOnInit(onInitCode.substring(indexOf('{') + 1), onInitCode.length);

	allFuncs.push({
		name: 'onInit',
		code: onInitCode
	});

	return allFuncs;
}

// remove extra enters
function __removeEnters(code) {
	var lines = code.split('\n');
	var newCode = "";

	lines.forEach(line => {
		if (line != '') {
			newCode += line + '\n';
		}
	});

	return newCode;
}

// add tabulation
function __addTabulation(code) {
	var lines = code.split('\n');
	var newCode = "";
	var level = 0;

	lines.forEach(line => {
		let isHaveCode = false;

		if (line.charAt(0) == '}') {
			isHaveCode = true;
			--level;
		}

		let tabs = "";
		for (let i = 0; i < level; i++) {
			tabs += '\t';
		}

		if (line.includes('\t')) {
			let lineCopy = line;
			line = "";
			for (let i = 0; i < lineCopy.length; i++) {
				if (lineCopy.charAt(i)) {
					line = lineCopy.substring(i, lineCopy.length);
					break;
				}
			}
		}

		newCode += tabs + line + '\n';
		level += line.includes('{');
		level -= (line.includes('}') && !isHaveCode);

		if (line == '}') {
			newCode += '\n';
		}

	});

	return newCode;
}

// remove extra enters, add tabulation and etc
function __makeReadable(code) {
	var newCode = __removeEnters(code);
	newCode = __addTabulation(newCode);
	return newCode;
}

// is have 2 or more events on 1 deivce
function __isEventDuplicate(events) {
	var addrs = [];

	// find all event addresses
	events.forEach(element => {
		addrs.push(element.name);
	});

	// compare addresses
	let addrsLen = addrs.length;
	for (let i = 0; i < addrsLen; i++) {
		for (let j = i + 1; j < addrsLen; j++) {
			if (addrs[i] == addrs[j]) {
				return {
					answer: true,
					data: addrs[j]
				};
			}
		}
	}

	return {
		answer: false
	};
}

// run debug
function __debug(elements) {
	let result = __isEventDuplicate(elements.events);
	if (result.answer) {
		let error = "ERROR: some events is duplicated! " + result.data;
		console.error(result.data);
		throw error;
	}
}

// remove glabals and add it to code
function __includeGlobalsToCode(elements) {
	var vars = elements.vars;
	var codeElements = [];
	var changeIndexes = { from: [], to: [], isFunc: [] };
	var newVars = [];
	var newEvents = [];
	var newFuncs = [];
	// add functions and event to one array
	elements.funcs.forEach(element => {
		codeElements.push(element)
	});
	elements.events.forEach(element => {
		codeElements.push(element)
	});
	for (var i = 0; i < vars.length; i++) {
		// find count of using global vars in funcs and events
		var codeIndexes = [], j = 0;
		for (j = 0; j < codeElements.length; j++) {
			// if more then 1 - break loop
			if (codeElements[j].code.includes(vars[i].name)) {
				codeIndexes.push(j);
				if (codeIndexes.length <= 1) {
					continue;
				} else {
					break;
				}
			}
		}
		if (codeIndexes.length == 2) {
			// if count == 2 - add var in new vars
			newVars.push(vars[i]);
		} else if (codeIndexes.length == 1) {
			// if count == 1 - move variable from globals to local in function
			changeIndexes.from.push(i);
			changeIndexes.to.push(codeIndexes[0]);
			// if function
			changeIndexes.isFunc.push(j < elements.funcs.length);
		}
	}
	// add funcs and change
	for (i = 0; i < codeElements.length; i++) {
		// create new elements list
		var index = changeIndexes.to.indexOf(i);
		if (index != -1) {
			continue;
		}
		if (i < elements.funcs.length) {
			// function
			newFuncs.push(codeElements[i]);
		} else {
			// event
			newEvents.push(codeElements[i]);
		}
	}
	// add vars in funcs without douplicates
	var changed = { func: [], id: [], isFunc: [] };
	for (i = 0; i < changeIndexes.to.length; i++) {
		// check for duplicate
		var index = changed.id.indexOf(changeIndexes.to[i]);
		var funcProto = index == -1
			? codeElements[changeIndexes.to[i]]
			: changed.func[index];

		// include variable code
		var border = funcProto.code.indexOf('{') + 1;
		funcProto.code = funcProto.code.substring(0, border)
			+ '\n' + vars[changeIndexes.from[i]].code + '\n'
			+ funcProto.code.substring(border, funcProto.code.length);

		// if new function or event
		if (index == -1) {
			changed.func.push(funcProto);
			changed.id.push(changeIndexes.to[i]);
			changed.isFunc.push(changeIndexes.isFunc[i]);
		} else {
			// if it was duplicate
			changed.func[index] = funcProto;
		}
	}
	// add changed to new elements
	for (i = 0; i < changed.func.length; i++) {
		if (changed.isFunc[i]) {
			newFuncs.push(changed.func[i]);
		} else {
			newEvents.push(changed.func[i]);
		}
	}
	return {
		vars: newVars,
		funcs: newFuncs,
		events: newEvents
	};
}

// remove no called functions
function __removeNoCalledFuncs(elements) {
	// add funcs and events to one array
	var allElements = [];

	elements.funcs.forEach(element => {
		allElements.push(element);
	});

	elements.events.forEach(element => {
		allElements.push(element);
	});

	// while start or was removed some element - check other for remove
	var removed = true;
	while (removed) {
		removed = false;

		// check funcs for calls
		for (let i = 0; i < elements.funcs.length; i++) {
			if (allElements[i] == null || allElements[i].name == 'onInit') {
				continue;
			}
			let includes = false;
			// regexp from call function
			//var regCall = new RegExp(elements.funcs[i].name
			//+ '(', 'gm');
			// regexp for delayedCall or cancelDelayedCall
			//var regDelayed = new RegExp(
			//'delayedCall[RMs]{0,3}('
			//+ elements.funcs[i].name, 'gm');
			for (let j = 0; j < allElements.length; j++) {
				if (i != j && allElements[j] != null) {
					if (__isIncludeFunctionCall(
						elements.funcs[i].name, allElements[j].code)) {
						// if called - break
						includes = true;
						break;
					}
				}
			}

			// if no calls - remove
			if (!includes) {
				allElements[i] = null;
				removed = true;
			}
		}
	}

	// collect functions
	var newFuncs = [];
	for (var i = 0; i < elements.funcs.length; i++) {
		if (allElements[i] != null) {
			newFuncs.push(allElements[i]);
		}
	}

	// collect events
	var newEvents = [];
	for (; i < allElements.length; i++) {
		if (allElements[i] != null) {
			newEvents.push(allElements[i]);
		}
	}

	return {
		vars: elements.vars,
		funcs: newFuncs,
		events: newEvents
	};
}

// remove function calls from functions and events
function __removeEmptyFuncCalls(name, elements) {
	var newElements = [];
	// regexp from call function
	// var regCall = new RegExp(name + '(');
	// // regexp for delayedCall or cancelDelayedCall
	// var regDelayed = new RegExp(
	//	 'delayedCall[RMs]{0,3}(' + name);

	elements.forEach(element => {
		if (element != null && element.name != name
			&& element.code.includes(name)) {

			var lines = element.code.split('\n');
			var newCode = lines[0] + '\n';

			// remove line with call 
			for (let i = 1; i < lines.length; i++) {
				if (!__isIncludeFunctionCall(name, lines[i])) {
					newCode += lines[i] + '\n';
				}
			}

			newElements.push({ name: element.name, code: newCode });
		} else {
			newElements.push(element);
		}
	});

	return newElements;
}

// remove empty funcs and their calls
function __removeEmptyFuncs(elements) {
	// add funcs and events to one array
	var allElements = [];

	elements.funcs.forEach(element => {
		allElements.push(element);
	});
	elements.events.forEach(element => {
		allElements.push(element);
	});

	// while start or was removed some element - check other for remove
	var removed = true;
	while (removed) {
		removed = false;

		for (var i = 0; i < allElements.length; i++) {
			if (allElements[i] == null || allElements[i] == undefined) {
				continue;
			}

			// find begin and end of body
			var index1 = allElements[i].code.indexOf('{');
			var index2 = allElements[i].code.length - 1;

			for (; allElements[i].code.charAt(index2) != '}'
				&& index2 > index1; index2--) { }
			// if body is empty - remove 
			if (index1 != -1 && index2 != -1) {
				var body = allElements[i].code.substring(index1 + 1, index2);
				if (!((/\w+/gm).test(body))) {
					if (i < elements.funcs.length) {
						allElements = __removeEmptyFuncCalls(allElements[i].name,
							allElements);
					}
					allElements[i] = null;
					removed = true;
				}
			}
		}
	}

	// collect functions
	var newFuncs = [];
	for (var i = 0; i < elements.funcs.length; i++) {
		if (allElements[i] != null) {
			newFuncs.push(allElements[i]);
		}
	}

	// collect events
	var newEvents = [];
	for (; i < allElements.length; i++) {
		if (allElements[i] != null) {
			newEvents.push(allElements[i]);
		}
	}

	return {
		vars: elements.vars,
		funcs: newFuncs,
		events: newEvents
	};
}

// remove no called, empty functions and thrair calls from code
function __removeExtraFuncs(elements) {
	var newElements = __removeEmptyFuncs(elements);
	newElements = __removeNoCalledFuncs(newElements);
	return newElements;
}

// optimize code
function __optimize(elements) {
	var newElements = elements;
	newElements = __removeExtraFuncs(newElements);
	//newElements = __includeGlobalsToCode(newElements);
	return newElements;
}

// filtrate generated code from blockly
function filtrate(code) {
	//nsole.log(code);
	// global elements (global vars, functions, events)
	var elements = __getElements(code);
	// optimize code
	// console.log("optimize");
	elements = __optimize(elements);
	// console.log("end optimize");
	// merge all onInits in one
	// console.log("merge");
	elements.funcs = __mergeOnInits(elements.funcs);
	// console.log("end merge");
	// set funcs in order
	// console.log("make tree");
	elements.funcs = __makeFuncsTree(elements.funcs);
	// console.log("end make tree");
	// find errors in new code
	// console.log("debug");
	__debug(elements);
	// console.log("end debug");
	// new code in order
	// console.log("compose");
	var newCode = __compose(elements);
	// console.log("end compose");
	// add tabulation, remove extra enters and etc
	
	//console.log("make readable");
	newCode = __makeReadable(newCode);
	//console.log("end make readable");
	// console.log('DONE!');

	return newCode;
}

//end blockly generated code filter ####################################################################################
/**
 * Generate additems
 */
function genarete_additem(_item) {
	var add_item = '<additem tag="item"';
	if (_item.id && /^\d{3}$/.test(_item.id)) {
		add_item += ' id="' + _item.id + '"';
	} else {
		add_item = null;
	}
	if (add_item && _item.type) {
		add_item += ' type="' + _item.type + '"';
	} else {
		add_item = null;
	}
	if (add_item && _item.name) {
		add_item += ' name="' + _item.name + '"';
	} else {
		add_item = null;
	}
	if (add_item && _item.sub_type) {
		add_item += ' sub-type="' + _item.sub_type + '"';
	}
	if (add_item && _item.sub_id) {
		add_item += ' sub-id="' + _item.sub_id + '"';
	} else if (add_item) {
		add_item += ' sub-id="%SUBID%"';
	}
	if (add_item && _item.values) {
		if (Array.isArray(_item.values)) {
			_item.values.forEach(value => {
				if (value[0] && value[1]) {
					switch (value[0]) {
						case 'value':
							add_item += ' value="' + value[1] + '"';
							break;
						case 'system':
							if (value[1] == 'yes')
								add_item += ' system="yes"';
							break;
						case 'image':
							add_item += ' image="' + value[1] + '"';
							break;
						case 'color-temp':
							add_item += ' color-temp="' + value[1] + '"';
							break;
						case 'color-white':
							add_item += ' color-white="' + value[1] + '"';
							break;
						case 'temperature-sensors':
							add_item += ' temperature-sensors="' + value[1] + '"';
							break;
						case 'automation':
							add_item += ' automation="' + value[1] + '"';
							break;
						case 'leak-sensors':
							add_item += ' leak-sensors="' + value[1] + '"';
							break;
						case 't-min':
							if (/^\d+$/.test(value[1]))
								add_item += ' t-min="' + value[1] + '"';
							break;
						case 't-delta':
							if (/^\d+$/.test(value[1]))
								add_item += ' t-delta="' + value[1] + '"';
							break;
						case 'modes':
							if (/^0x[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' modes="' + value[1] + '"';
							else if (/^[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' modes="' + value[1] + '"';
							break;
						case 'funs':
							if (/^0x[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' funs="' + value[1] + '"';
							else if (/^[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' funs="' + value[1] + '"';
							break;
						case 'vane-ver':
							if (/^0x[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' vane-ver="' + value[1] + '"';
							else if (/^[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' vane-ver="' + value[1] + '"';
							break;
						case 'vane-hor':
							if (/^0x[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' vane-hor="' + value[1] + '"';
							else if (/^[0-9-a-f-A-F]{1,2}$/.test(value[1]))
								add_item += ' vane-hor="' + value[1] + '"';
							break;
						case 'scale':
							if (/^\d+:\d+$/.test(value[1]))
								add_item += ' scale="' + value[1] + '"';
							else if (value[1] == 'auto')
								add_item += ' scale="' + value[1] + '"';
							break;
						case 'log-levels':
							if (/^(\d+,){2}\d+$/.test(value[1]))
								add_item += ' log-levels="' + value[1] + '"';
							break;
						case 'text':
							break;
						case 'path':
							if (/^scripts\/.+\.txt$/.test(value[1]))
								add_item += ' log-levels="' + value[1] + '"';
							break;
						case 'virtual':
							if (value[1] == 'yes')
								add_item += ' virtual="yes"';
							break;
						case 'dim':
							add_item += ' dim="' + value[1] + '"';
							break;
						case 'varname':
							add_item += ' varname="' + value[1] + '"';
							break;
						default:
							break;
					}
				}
			});
		} else {
			add_item += ' value="' + _item.values + '"';
		}
	}
	if (add_item) {
		return add_item + '/>';
	}
}
function get_additems() {
	var add_items = '<additems>',
		items = [];
	Blockly.getMainWorkspace().getAllBlocks().forEach(block => {
		if (block.add_items) {
			items = items.concat(block.add_items);
		}
	});
	var i = 0;
	items.forEach(item => {
		if (!item.sub_id) {
			item.sub_id = '%SUBID0' + i + '%';
			++i;
		}
		if (genarete_additem(item) != undefined)
			add_items += genarete_additem(item);
	});
	if (add_items.length == '<additems>'.length)
		add_items = null;
	if (add_items)
		return add_items + '</additems>';
	/*
	<additems>
		<additem tag="item" id="%TARGET%" name="DESCR" sub-id="%SUBID%" type="virtual" sub-type="ventilation"/>
	</additems>
	*/
}