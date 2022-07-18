<?php

class JsModules
{
	const MODULES_PATH = '../js/modules/%s';
	
	public function getModule($name)
	{
		$file = sprintf(self::MODULES_PATH, $name);
		if (file_exists($file))
		{
			$data = file_get_contents($file);
			return $data;
		}
		else
		{
			throw new \Exception();
		}
	}

	public function getModuleV2()
	{
		session_write_close();
		$name = $_REQUEST["param0"];
		
		$file = sprintf(self::MODULES_PATH, $name);
		if (file_exists($file))
		{
			$content = file_get_contents($file);
			$answer = sprintf('modelTmp = %s;', $content);
			
			Header("Content-type: text/javascript");
			ob_flush();
			flush();
			echo $answer;
			ob_flush();
			flush();
			exit;
		}
		else
		{
			throw new \Exception();
		}
	}

	public function getModulesV2()
	{
		session_write_close();

		$answer = array("var pagesTmp = {};");
		$jsmodules = array(
				'overview' => 'msadmin.overview.js',
				'initialization' => 'msadmin.initialization.js',

				'settings_general' => 'msadmin.settings.general.js',
				'settings_backup_restore' => 'msadmin.settings.backup.js',
				'settings_security' => 'msadmin.settings.security.js',
				'settings_network' => 'msadmin.settings.network.js',


				'general_modules' => 'msadmin.general.modules.js',
				'general_structure' => 'msadmin.general.structure.js',
				'general_remotes' => 'msadmin.general.remotes.js',
				'general_cameras' => 'msadmin.general.cameras.js',
				'general_scripts' => 'msadmin.general.scripts.js',
				'general_map' => 'msadmin.general.map.js',
				'general_trace' => 'msadmin.general.trace.js',
				'general_skins' => 'msadmin.general.skins.js',
				'general_plugins' => 'msadmin.general.plugins.js',
				'general_messengers' => 'msadmin.general.messengers.js',
				'general_webhooks' => 'msadmin.general.webhooks.js',
				'general_accounts' => 'msadmin.general.osaccounts.js',
				'general_climatecontrol' => 'msadmin.general.climatecontrol.js',
				'general_voice_assistants' => 'msadmin.general.voiceassistants.js',

				'system_logs' => 'msadmin.system.logs.js',
				'system_updates' => 'msadmin.system.updates.js',
				'system_reboot' => 'msadmin.system.reboot.js',
				'system_features' => 'msadmin.system.features.js',
				'system_server_console' => 'msadmin.system.server_console.js',
				'system_udpview' => 'msadmin.system.udpview.js',

				'help_about' => 'msadmin.help.about.js',
				'help_documents' => 'msadmin.help.doc.js',
				'help_terms' => 'msadmin.help.terms.js'
		);

		
				
		foreach ($jsmodules as $module => $name) {
			$file = sprintf(self::MODULES_PATH, $name);
			if (file_exists($file))
			{
				$content = file_get_contents($file);
				$answer[] = sprintf('pagesTmp["%s"] = %s;', $module, $content);
			}
			else
			{
				throw new \Exception();
			}
		}
		
		Header("Content-type: text/javascript");
		ob_flush();
		flush();
		echo implode("", $answer);
		ob_flush();
		flush();
		exit;
	}

	public function getModules($jsmodules = null)
	{
		session_write_close();
		
		$answer = array();
		
		if(is_array($jsmodules) && count($jsmodules))
			foreach ($jsmodules as $module => $name) {
				$file = sprintf(self::MODULES_PATH, $name);
				if (file_exists($file))
				{
					$answer[$module] = file_get_contents($file);
				}
				else
				{
					throw new \Exception();
				}
			}
		
		return $answer;
	}

	public function getJScripts()
	{
		session_write_close();
		
		$files = array();
		$files[] = "jquery-1.11.3.min.js";
		$files[] = "bootstrap.min.js";
		$files[] = "datepicker/moment-with-locales.min.js";
		$files[] = "datepicker/bootstrap-datetimepicker.min.js";
		$files[] = "daterangepicker/daterangepicker.js";
		$files[] = "bootbox/bootbox.min.js";
		$files[] = "select/bootstrap-select.min.js";
		$files[] = "fileinput/fileinput.min.js";
		$files[] = "fileinput/fileinput.lang.js";
		$files[] = "mask/jquery.mask.min.js";
		$files[] = "jstree/jstree.min.js";
		$files[] = "jstree/jstree-actions.min.js";
		$files[] = "flot/jquery.flot.min.js";
		$files[] = "flot/jquery.flot.resize.min.js";
		$files[] = "flot/jquery.flot.time.min.js";
		$files[] = "touch/jquery.doubletap.js";
		$files[] = "touch/hammer.min.js";
		$files[] = "esimakin-twbs-pagination/jquery.twbsPagination.min.js";
		$files[] = "p-loading/dist/js/p-loading.min.js";
		$files[] = "jquery-plugins/js.cookie.js";
		$files[] = "jquery-plugins/ipInput.js";
		
		$files[] = "jquery-file-upload/load-image.all.min.js";
		$files[] = "jquery-file-upload/canvas-to-blob.min.js";
		$files[] = "jquery-file-upload/vendor/jquery.ui.widget.js";
		$files[] = "jquery-file-upload/jquery.iframe-transport.js";
		$files[] = "jquery-file-upload/jquery.fileupload.js";
		$files[] = "jquery-file-upload/jquery.fileupload-process.js";
		$files[] = "jquery-file-upload/jquery.fileupload-image.js";
		$files[] = "jquery-file-upload/jquery.fileupload-audio.js";
		$files[] = "jquery-file-upload/jquery.fileupload-video.js";
		$files[] = "jquery-file-upload/jquery.fileupload-validate.js";
		
		$files[] = "bootstrap-slider/bootstrap-slider.min.js";
		$files[] = "clipboard/clipboard.min.js";
		$files[] = "reconnecting-websocket/reconnecting-websocket.min.js";
		$files[] = "blockly/getdatamethods.js";
		$files[] = "blockly/modulevars.js";
		$files[] = "blockly/grafmethods.js";
		$files[] = "msadmin.core.js";
		$files[] = "base64.js";
		$files[] = "blockly/blockly_compressed.js";
		$files[] = "blockly/javascript_compressed.js";
		
		$folders = array();
				
		$cacheFile = TMP_DIR . "jscode.cache";
		
		if(count($folders))
		{
			foreach ($folders as $pattern)
			{
				$foundFiles = glob($pattern);
				if(is_array($foundFiles) && count($foundFiles) > 0)
				{
					$files = array_merge($files, $foundFiles);
				}
			}
		}
		
		
		if(CACHE_OF_BROWSER === TRUE)
		{
			header("Expires: Sat, 26 Jul 2060 05:00:00 GMT");
			header("Cache-Control: public, max-age=31536000");
			header("Pragma: cache");
		}
		
		header("Content-type: text/javascript");
		ob_flush();
		flush();
		if(CACHE_FILES && file_exists($cacheFile)) readfile($cacheFile);
		else {
			foreach ($files as $filename) {
				$file = (strpos($filename, "../js/") !== FALSE?"":"../js/") . $filename;
				if(file_exists($file)) {
					if(CACHE_FILES){
						$data = file_get_contents($file);
						file_put_contents($cacheFile, $data . "\n\n", FILE_APPEND);
						echo $data, "\n\n";
					}else {
						readfile($file);
						echo "\n\n";
					}
				}
			}
		}
		exit;
	}
	
	public function getBlocklyTr($lang = "en")
	{
		session_write_close();
		
		
		$file = sprintf('../js/blockly/msg/js/%s.js', $lang);
		if (!file_exists($file)) $file = '../js/blockly/msg/js/en.js';
		
		Header("Content-type: text/javascript");
		readfile($file);
		ob_flush();
		flush();
		exit;
	}

	public function getBlocklyBlocks()
	{
		session_write_close();
		
		$files = array();
		
		$folders = array();
		$folders[] = "../js/blockly/blocks/*.js";
				
		if(count($folders))
		{
			foreach ($folders as $pattern)
			{
				$foundFiles = glob($pattern);
				if(is_array($foundFiles) && count($foundFiles) > 0)
				{
					$files = array_merge($files, $foundFiles);
				}
			}
		}
		
		
		header("Content-type: text/javascript");
		ob_flush();
		flush();
		foreach ($files as $filename)
		{
			if(file_exists($filename))
			{
				readfile($filename);
				echo "\n\n";
			}
		}
		exit;
	}
	
	private function logger($msg = "")
	{
		global $globalSettings;
		$data = $msg . "\n";
		if($globalSettings["logFile"] != "") @file_put_contents($globalSettings["logFile"], $data, FILE_APPEND);
	}
}

?>