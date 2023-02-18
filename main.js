/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/python-shell/index.js
var require_python_shell = __commonJS({
  "node_modules/python-shell/index.js"(exports) {
    "use strict";
    var __awaiter = exports && exports.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PythonShell = exports.NewlineTransformer = exports.PythonShellErrorWithLogs = exports.PythonShellError = void 0;
    var events_1 = require("events");
    var child_process_1 = require("child_process");
    var os_1 = require("os");
    var path_1 = require("path");
    var stream_1 = require("stream");
    var fs_1 = require("fs");
    var util_1 = require("util");
    function toArray(source) {
      if (typeof source === "undefined" || source === null) {
        return [];
      } else if (!Array.isArray(source)) {
        return [source];
      }
      return source;
    }
    function extend(obj, ...args) {
      Array.prototype.slice.call(arguments, 1).forEach(function(source) {
        if (source) {
          for (let key in source) {
            obj[key] = source[key];
          }
        }
      });
      return obj;
    }
    function getRandomInt() {
      return Math.floor(Math.random() * 1e10);
    }
    var execPromise = (0, util_1.promisify)(child_process_1.exec);
    var PythonShellError = class extends Error {
    };
    exports.PythonShellError = PythonShellError;
    var PythonShellErrorWithLogs = class extends PythonShellError {
    };
    exports.PythonShellErrorWithLogs = PythonShellErrorWithLogs;
    var NewlineTransformer = class extends stream_1.Transform {
      _transform(chunk, encoding, callback) {
        let data = chunk.toString();
        if (this._lastLineData)
          data = this._lastLineData + data;
        const lines = data.split(os_1.EOL);
        this._lastLineData = lines.pop();
        lines.forEach(this.push.bind(this));
        callback();
      }
      _flush(done) {
        if (this._lastLineData)
          this.push(this._lastLineData);
        this._lastLineData = null;
        done();
      }
    };
    exports.NewlineTransformer = NewlineTransformer;
    var PythonShell2 = class extends events_1.EventEmitter {
      /**
       * spawns a python process
       * @param scriptPath path to script. Relative to current directory or options.scriptFolder if specified
       * @param options
       * @param stdoutSplitter Optional. Splits stdout into chunks, defaulting to splitting into newline-seperated lines
       * @param stderrSplitter Optional. splits stderr into chunks, defaulting to splitting into newline-seperated lines
       */
      constructor(scriptPath, options, stdoutSplitter = null, stderrSplitter = null) {
        super();
        function resolve(type, val) {
          if (typeof val === "string") {
            return PythonShell2[type][val];
          } else if (typeof val === "function") {
            return val;
          }
        }
        if (scriptPath.trim().length == 0)
          throw Error("scriptPath cannot be empty! You must give a script for python to run");
        let self = this;
        let errorData = "";
        events_1.EventEmitter.call(this);
        options = extend({}, PythonShell2.defaultOptions, options);
        let pythonPath;
        if (!options.pythonPath) {
          pythonPath = PythonShell2.defaultPythonPath;
        } else
          pythonPath = options.pythonPath;
        let pythonOptions = toArray(options.pythonOptions);
        let scriptArgs = toArray(options.args);
        this.scriptPath = (0, path_1.join)(options.scriptPath || "", scriptPath);
        this.command = pythonOptions.concat(this.scriptPath, scriptArgs);
        this.mode = options.mode || "text";
        this.formatter = resolve("format", options.formatter || this.mode);
        this.parser = resolve("parse", options.parser || this.mode);
        this.stderrParser = resolve("parse", options.stderrParser || "text");
        this.terminated = false;
        this.childProcess = (0, child_process_1.spawn)(pythonPath, this.command, options);
        ["stdout", "stdin", "stderr"].forEach(function(name) {
          self[name] = self.childProcess[name];
          self.parser && self[name] && self[name].setEncoding(options.encoding || "utf8");
        });
        if (this.parser && this.stdout) {
          if (!stdoutSplitter)
            stdoutSplitter = new NewlineTransformer();
          stdoutSplitter.setEncoding(options.encoding || "utf8");
          this.stdout.pipe(stdoutSplitter).on("data", (chunk) => {
            this.emit("message", self.parser(chunk));
          });
        }
        if (this.stderrParser && this.stderr) {
          if (!stderrSplitter)
            stderrSplitter = new NewlineTransformer();
          stderrSplitter.setEncoding(options.encoding || "utf8");
          this.stderr.pipe(stderrSplitter).on("data", (chunk) => {
            this.emit("stderr", self.stderrParser(chunk));
          });
        }
        if (this.stderr) {
          this.stderr.on("data", function(data) {
            errorData += "" + data;
          });
          this.stderr.on("end", function() {
            self.stderrHasEnded = true;
            terminateIfNeeded();
          });
        } else {
          self.stderrHasEnded = true;
        }
        if (this.stdout) {
          this.stdout.on("end", function() {
            self.stdoutHasEnded = true;
            terminateIfNeeded();
          });
        } else {
          self.stdoutHasEnded = true;
        }
        this.childProcess.on("error", function(err) {
          self.emit("error", err);
        });
        this.childProcess.on("exit", function(code, signal) {
          self.exitCode = code;
          self.exitSignal = signal;
          terminateIfNeeded();
        });
        function terminateIfNeeded() {
          if (!self.stderrHasEnded || !self.stdoutHasEnded || self.exitCode == null && self.exitSignal == null)
            return;
          let err;
          if (self.exitCode && self.exitCode !== 0) {
            if (errorData) {
              err = self.parseError(errorData);
            } else {
              err = new PythonShellError("process exited with code " + self.exitCode);
            }
            err = extend(err, {
              executable: pythonPath,
              options: pythonOptions.length ? pythonOptions : null,
              script: self.scriptPath,
              args: scriptArgs.length ? scriptArgs : null,
              exitCode: self.exitCode
            });
            if (self.listeners("pythonError").length || !self._endCallback) {
              self.emit("pythonError", err);
            }
          }
          self.terminated = true;
          self.emit("close");
          self._endCallback && self._endCallback(err, self.exitCode, self.exitSignal);
        }
        ;
      }
      /**
       * checks syntax without executing code
       * @returns rejects promise w/ string error output if syntax failure
       */
      static checkSyntax(code) {
        return __awaiter(this, void 0, void 0, function* () {
          const randomInt = getRandomInt();
          const filePath = (0, os_1.tmpdir)() + path_1.sep + `pythonShellSyntaxCheck${randomInt}.py`;
          const writeFilePromise = (0, util_1.promisify)(fs_1.writeFile);
          return writeFilePromise(filePath, code).then(() => {
            return this.checkSyntaxFile(filePath);
          });
        });
      }
      static getPythonPath() {
        return this.defaultOptions.pythonPath ? this.defaultOptions.pythonPath : this.defaultPythonPath;
      }
      /**
       * checks syntax without executing code
       * @returns {Promise} rejects w/ stderr if syntax failure
       */
      static checkSyntaxFile(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
          const pythonPath = this.getPythonPath();
          let compileCommand = `${pythonPath} -m py_compile ${filePath}`;
          return execPromise(compileCommand);
        });
      }
      /**
       * Runs a Python script and returns collected messages as a promise.
       * If the promise is rejected, the err will probably be of type PythonShellErrorWithLogs
       * @param scriptPath   The path to the script to execute
       * @param options  The execution options
       */
      static run(scriptPath, options) {
        return new Promise((resolve, reject) => {
          let pyshell = new PythonShell2(scriptPath, options);
          let output = [];
          pyshell.on("message", function(message) {
            output.push(message);
          }).end(function(err) {
            if (err) {
              err.logs = output;
              reject(err);
            } else
              resolve(output);
          });
        });
      }
      /**
       * Runs the inputted string of python code and returns collected messages as a promise. DO NOT ALLOW UNTRUSTED USER INPUT HERE!
       * @param code   The python code to execute
       * @param options  The execution options
       * @return a promise with the output from the python script
       */
      static runString(code, options) {
        const randomInt = getRandomInt();
        const filePath = os_1.tmpdir + path_1.sep + `pythonShellFile${randomInt}.py`;
        (0, fs_1.writeFileSync)(filePath, code);
        return PythonShell2.run(filePath, options);
      }
      static getVersion(pythonPath) {
        if (!pythonPath)
          pythonPath = this.getPythonPath();
        return execPromise(pythonPath + " --version");
      }
      static getVersionSync(pythonPath) {
        if (!pythonPath)
          pythonPath = this.getPythonPath();
        return (0, child_process_1.execSync)(pythonPath + " --version").toString();
      }
      /**
       * Parses an error thrown from the Python process through stderr
       * @param  {string|Buffer} data The stderr contents to parse
       * @return {Error} The parsed error with extended stack trace when traceback is available
       */
      parseError(data) {
        let text = "" + data;
        let error;
        if (/^Traceback/.test(text)) {
          let lines = text.trim().split(os_1.EOL);
          let exception = lines.pop();
          error = new PythonShellError(exception);
          error.traceback = data;
          error.stack += os_1.EOL + "    ----- Python Traceback -----" + os_1.EOL + "  ";
          error.stack += lines.slice(1).join(os_1.EOL + "  ");
        } else {
          error = new PythonShellError(text);
        }
        return error;
      }
      /**
       * Sends a message to the Python shell through stdin
       * Override this method to format data to be sent to the Python process
       * @returns {PythonShell} The same instance for chaining calls
       */
      send(message) {
        if (!this.stdin)
          throw new Error("stdin not open for writing");
        let data = this.formatter ? this.formatter(message) : message;
        if (this.mode !== "binary")
          data += os_1.EOL;
        this.stdin.write(data);
        return this;
      }
      /**
       * Closes the stdin stream. Unless python is listening for stdin in a loop
       * this should cause the process to finish its work and close.
       * @returns {PythonShell} The same instance for chaining calls
       */
      end(callback) {
        if (this.childProcess.stdin) {
          this.childProcess.stdin.end();
        }
        this._endCallback = callback;
        return this;
      }
      /**
       * Sends a kill signal to the process
       * @returns {PythonShell} The same instance for chaining calls
       */
      kill(signal) {
        this.terminated = this.childProcess.kill(signal);
        return this;
      }
      /**
       * Alias for kill.
       * @deprecated
       */
      terminate(signal) {
        return this.kill(signal);
      }
    };
    exports.PythonShell = PythonShell2;
    PythonShell2.defaultPythonPath = process.platform != "win32" ? "python3" : "python";
    PythonShell2.defaultOptions = {};
    PythonShell2.format = {
      text: function toText(data) {
        if (!data)
          return "";
        else if (typeof data !== "string")
          return data.toString();
        return data;
      },
      json: function toJson(data) {
        return JSON.stringify(data);
      }
    };
    PythonShell2.parse = {
      text: function asText(data) {
        return data;
      },
      json: function asJson(data) {
        return JSON.parse(data);
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => GraphGuruPlugin
});
module.exports = __toCommonJS(main_exports);
var import_obsidian2 = require("obsidian");
var import_python_shell = __toESM(require_python_shell());

// src/settings.ts
var import_obsidian = require("obsidian");
var DefaultGuruSettings = {
  focus_directory: "./"
};
var GraphGuruSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Graph Guru Settings" });
    new import_obsidian.Setting(containerEl).setName("Focus Directory").setDesc("Enter the directory you wish for GraphGuru to focus on.").addText((text) => text.setPlaceholder("Enter your directory").setValue(this.plugin.settings.focus_directory).onChange(async (value) => {
      this.plugin.settings.focus_directory = value;
      await this.plugin.saveSettings();
    }));
  }
};

// src/main.ts
var GraphGuruPlugin = class extends import_obsidian2.Plugin {
  constructor() {
    super(...arguments);
    this.guruCoordinates = null;
  }
  async onload() {
    if (this.app.vault.adapter instanceof import_obsidian2.FileSystemAdapter) {
      this.path = this.app.vault.adapter.getBasePath();
      this.pythonScriptsPath = this.path + "/.obsidian/plugins/obsidian-graph-guru/src/processing/test.py";
    }
    this.settings = Object.assign({}, DefaultGuruSettings, await this.loadData());
    await this.saveSettings();
    this.addSettingTab(new GraphGuruSettingTab(this.app, this));
    this.statusBar = this.addStatusBarItem();
    this.statusBar.setText(`Focused Directory is ${this.settings.focus_directory}`);
    this.addCommand({
      id: "init-graph-guru",
      name: "Initialize GraphGuru",
      callback: async () => {
        const guruCoordinates = await this.initialize();
        if (guruCoordinates != null) {
          this.guruCoordinates = guruCoordinates;
          new import_obsidian2.Notice("GraphGuru is initialized");
        } else {
          new import_obsidian2.Notice("GraphGuru is not initialized");
        }
      }
    });
    this.addRibbonIcon("palmtree", "Open GraphGuru", async () => {
      if (this.guruCoordinates != null) {
        new import_obsidian2.Notice("GraphGuru is initialized");
      } else {
        new import_obsidian2.Notice("GraphGuru is not initialized");
      }
    });
  }
  async initialize() {
    console.log("Initializing GraphGuru");
    try {
      const files = Promise.all(await this.getVaultAllFiles());
      const result = await this.sendToPython(await files);
      console.log(result);
      return result;
    } catch (error) {
      console.log(error);
    }
  }
  async sendToPython(files) {
    try {
      const operations = files.map(
        (input) => new Promise((resolve, reject) => {
          const pyshell = new import_python_shell.PythonShell(this.pythonScriptsPath);
          pyshell.send(JSON.stringify(input));
          pyshell.on("message", (message) => {
            try {
              const output = JSON.parse(message);
              resolve(output);
            } catch (err) {
              reject(err);
            }
          });
          pyshell.end(function(err, code, signal) {
            if (err)
              throw err;
            console.log("The exit code was: " + code);
            console.log("The exit signal was: " + signal);
            console.log("finished");
          });
        })
      );
      const results = await Promise.all(operations);
      return results;
    } catch (error) {
      console.log(error);
    }
  }
  async getVaultAllFiles() {
    const files = this.app.vault.getFiles();
    const fileObjects = files.map(async (f) => {
      const text = await this.app.vault.read(f);
      const metadata = this.app.metadataCache.getFileCache(f);
      let tags = null;
      if (metadata != null) {
        tags = (0, import_obsidian2.getAllTags)(metadata);
      }
      return {
        text,
        // metadata: metadata,
        tags
      };
    });
    return fileObjects;
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }
  onunload() {
    console.log("unloading plugin");
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibm9kZV9tb2R1bGVzL3B5dGhvbi1zaGVsbC9pbmRleC50cyIsICJzcmMvbWFpbi50cyIsICJzcmMvc2V0dGluZ3MudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbbnVsbCwgImltcG9ydCB7IEZpbGVTeXN0ZW1BZGFwdGVyLCBOb3RpY2UsIFBsdWdpbiwgVEZpbGUsIENhY2hlZE1ldGFkYXRhLCBnZXRBbGxUYWdzIH0gZnJvbSAnb2JzaWRpYW4nO1xuaW1wb3J0IHsgUHl0aG9uU2hlbGwgfSBmcm9tICdweXRob24tc2hlbGwnO1xuaW1wb3J0IHsgR3JhcGhHdXJ1U2V0dGluZ3MsIEdyYXBoR3VydVNldHRpbmdUYWIsIERlZmF1bHRHdXJ1U2V0dGluZ3MgfSBmcm9tICcuL3NldHRpbmdzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhcGhHdXJ1UGx1Z2luIGV4dGVuZHMgUGx1Z2luIHtcbiAgICBzZXR0aW5nczogR3JhcGhHdXJ1U2V0dGluZ3M7XG4gICAgcGF0aDogc3RyaW5nO1xuICAgIHB5dGhvblNjcmlwdHNQYXRoOiBzdHJpbmc7XG4gICAgc3RhdHVzQmFyOiBIVE1MRWxlbWVudDtcbiAgICBndXJ1Q29vcmRpbmF0ZXM6IG9iamVjdFtdIHwgdW5rbm93bltdIHwgbnVsbCA9IG51bGw7XG5cbiAgICBhc3luYyBvbmxvYWQoKSB7XG4gICAgXG4gICAgICAgIGlmICh0aGlzLmFwcC52YXVsdC5hZGFwdGVyIGluc3RhbmNlb2YgRmlsZVN5c3RlbUFkYXB0ZXIpIHtcblx0XHRcdHRoaXMucGF0aCA9IHRoaXMuYXBwLnZhdWx0LmFkYXB0ZXIuZ2V0QmFzZVBhdGgoKTtcbiAgICAgICAgICAgIHRoaXMucHl0aG9uU2NyaXB0c1BhdGggPSB0aGlzLnBhdGggKyAnLy5vYnNpZGlhbi9wbHVnaW5zL29ic2lkaWFuLWdyYXBoLWd1cnUvc3JjL3Byb2Nlc3NpbmcvdGVzdC5weSc7XG5cdFx0fVxuXG4gICAgICAgIHRoaXMuc2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHt9LCBEZWZhdWx0R3VydVNldHRpbmdzLCBhd2FpdCB0aGlzLmxvYWREYXRhKCkpO1xuICAgICAgICBhd2FpdCB0aGlzLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICB0aGlzLmFkZFNldHRpbmdUYWIobmV3IEdyYXBoR3VydVNldHRpbmdUYWIodGhpcy5hcHAsIHRoaXMpKTtcbiAgICAgICAgdGhpcy5zdGF0dXNCYXIgPSB0aGlzLmFkZFN0YXR1c0Jhckl0ZW0oKTtcblx0XHR0aGlzLnN0YXR1c0Jhci5zZXRUZXh0KGBGb2N1c2VkIERpcmVjdG9yeSBpcyAke3RoaXMuc2V0dGluZ3MuZm9jdXNfZGlyZWN0b3J5fWApO1xuXG4gICAgICAgIHRoaXMuYWRkQ29tbWFuZCh7XG4gICAgICAgICAgICBpZDogJ2luaXQtZ3JhcGgtZ3VydScsXG4gICAgICAgICAgICBuYW1lOiAnSW5pdGlhbGl6ZSBHcmFwaEd1cnUnLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBndXJ1Q29vcmRpbmF0ZXMgPSBhd2FpdCB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgICAgICBpZiAoZ3VydUNvb3JkaW5hdGVzICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ndXJ1Q29vcmRpbmF0ZXMgPSBndXJ1Q29vcmRpbmF0ZXM7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJHcmFwaEd1cnUgaXMgaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbmV3IE5vdGljZShcIkdyYXBoR3VydSBpcyBub3QgaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICBcbiAgICAgICAgdGhpcy5hZGRSaWJib25JY29uKFwicGFsbXRyZWVcIiwgXCJPcGVuIEdyYXBoR3VydVwiLCBhc3luYyAoKSA9PiB7IC8vIG9yIG1hcCBvciBhbmNob3IgZm9yIGljb24gXG4gICAgICAgICAgICBpZiAodGhpcy5ndXJ1Q29vcmRpbmF0ZXMgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIG5ldyBOb3RpY2UoXCJHcmFwaEd1cnUgaXMgaW5pdGlhbGl6ZWRcIik7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy5ndXJ1Q29vcmRpbmF0ZXMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBuZXcgTm90aWNlKFwiR3JhcGhHdXJ1IGlzIG5vdCBpbml0aWFsaXplZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGFzeW5jIGluaXRpYWxpemUoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiSW5pdGlhbGl6aW5nIEdyYXBoR3VydVwiKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGVzID0gUHJvbWlzZS5hbGwoYXdhaXQgdGhpcy5nZXRWYXVsdEFsbEZpbGVzKCkpO1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5zZW5kVG9QeXRob24oYXdhaXQgZmlsZXMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0gY2F0Y2goZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGFzeW5jIHNlbmRUb1B5dGhvbihmaWxlczogb2JqZWN0W10pIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbnMgPSBmaWxlcy5tYXAoaW5wdXQgPT5cbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcHlzaGVsbCA9IG5ldyBQeXRob25TaGVsbCh0aGlzLnB5dGhvblNjcmlwdHNQYXRoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHB5c2hlbGwuc2VuZChKU09OLnN0cmluZ2lmeShpbnB1dCkpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcHlzaGVsbC5vbignbWVzc2FnZScsIChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgb3V0cHV0ID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvdXRwdXQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICAgICBweXNoZWxsLmVuZChmdW5jdGlvbiAoZXJyLCBjb2RlLCBzaWduYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlIGV4aXQgY29kZSB3YXM6ICcgKyBjb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1RoZSBleGl0IHNpZ25hbCB3YXM6ICcgKyBzaWduYWwpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZmluaXNoZWQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc3QgcmVzdWx0cyA9IGF3YWl0IFByb21pc2UuYWxsKG9wZXJhdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgICAgIFxuICAgIGFzeW5jIGdldFZhdWx0QWxsRmlsZXMoKSB7XG4gICAgICAgIGNvbnN0IGZpbGVzOiBURmlsZVtdID0gdGhpcy5hcHAudmF1bHQuZ2V0RmlsZXMoKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IGZpbGVPYmplY3RzID0gZmlsZXMubWFwKGFzeW5jIChmKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0ZXh0OiBzdHJpbmcgPSBhd2FpdCB0aGlzLmFwcC52YXVsdC5yZWFkKGYpO1xuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGE6IENhY2hlZE1ldGFkYXRhIHwgbnVsbCA9IHRoaXMuYXBwLm1ldGFkYXRhQ2FjaGUuZ2V0RmlsZUNhY2hlKGYpO1xuICAgICAgICAgICAgbGV0IHRhZ3M6IHN0cmluZ1tdIHwgbnVsbCA9IG51bGxcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG1ldGFkYXRhICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0YWdzID0gZ2V0QWxsVGFncyhtZXRhZGF0YSk7ICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRleHQ6IHRleHQsXG4gICAgICAgICAgICAgICAgLy8gbWV0YWRhdGE6IG1ldGFkYXRhLFxuICAgICAgICAgICAgICAgIHRhZ3M6IHRhZ3NcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZpbGVPYmplY3RzO1xuICAgIH1cblxuICAgIGFzeW5jIHNhdmVTZXR0aW5ncygpIHtcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlRGF0YSh0aGlzLnNldHRpbmdzKTtcbiAgICB9XG5cbiAgICBvbnVubG9hZCgpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9hZGluZyBwbHVnaW4nKTtcbiAgICB9XG59IiwgImltcG9ydCB7QXBwLCBQbHVnaW5TZXR0aW5nVGFiLCBTZXR0aW5nfSBmcm9tIFwib2JzaWRpYW5cIjtcblxuaW1wb3J0IEdyYXBoR3VydVBsdWdpbiBmcm9tIFwiLi9tYWluXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JhcGhHdXJ1U2V0dGluZ3Mge1xuICAgIGZvY3VzX2RpcmVjdG9yeTogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgRGVmYXVsdEd1cnVTZXR0aW5nczogR3JhcGhHdXJ1U2V0dGluZ3M9IHtcbiAgICBmb2N1c19kaXJlY3Rvcnk6ICcuLycsXG59IFxuXG5leHBvcnQgY2xhc3MgR3JhcGhHdXJ1U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuICAgIHBsdWdpbjogR3JhcGhHdXJ1UGx1Z2luO1xuICAgIGNvbnN0cnVjdG9yKGFwcDogQXBwLCBwbHVnaW46IEdyYXBoR3VydVBsdWdpbikge1xuICAgICAgICBzdXBlcihhcHAsIHBsdWdpbik7XG4gICAgICAgIHRoaXMucGx1Z2luID0gcGx1Z2luO1xuICAgIH1cblxuICAgIGRpc3BsYXkoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHtjb250YWluZXJFbH0gPSB0aGlzO1xuXG4gICAgICAgIGNvbnRhaW5lckVsLmVtcHR5KCk7XG5cbiAgICAgICAgY29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdHcmFwaCBHdXJ1IFNldHRpbmdzJ30pO1xuXG4gICAgICAgIG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuICAgICAgICAgICAgLnNldE5hbWUoJ0ZvY3VzIERpcmVjdG9yeScpXG4gICAgICAgICAgICAuc2V0RGVzYygnRW50ZXIgdGhlIGRpcmVjdG9yeSB5b3Ugd2lzaCBmb3IgR3JhcGhHdXJ1IHRvIGZvY3VzIG9uLicpXG4gICAgICAgICAgICAuYWRkVGV4dCh0ZXh0ID0+IHRleHRcbiAgICAgICAgICAgICAgICAuc2V0UGxhY2Vob2xkZXIoJ0VudGVyIHlvdXIgZGlyZWN0b3J5JylcbiAgICAgICAgICAgICAgICAuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9jdXNfZGlyZWN0b3J5KVxuICAgICAgICAgICAgICAgIC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wbHVnaW4uc2V0dGluZ3MuZm9jdXNfZGlyZWN0b3J5ID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICB9XG59XG5cblxuXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxRQUFBLFdBQUEsUUFBQSxRQUFBO0FBQ0EsUUFBQSxrQkFBQSxRQUFBLGVBQUE7QUFDQSxRQUFBLE9BQUEsUUFBQSxJQUFBO0FBQ0EsUUFBQSxTQUFBLFFBQUEsTUFBQTtBQUNBLFFBQUEsV0FBQSxRQUFBLFFBQUE7QUFDQSxRQUFBLE9BQUEsUUFBQSxJQUFBO0FBQ0EsUUFBQSxTQUFBLFFBQUEsTUFBQTtBQUVBLGFBQVMsUUFBVyxRQUFnQjtBQUNoQyxVQUFJLE9BQU8sV0FBVyxlQUFlLFdBQVcsTUFBTTtBQUNsRCxlQUFPLENBQUE7aUJBQ0EsQ0FBQyxNQUFNLFFBQVEsTUFBTSxHQUFHO0FBQy9CLGVBQU8sQ0FBQyxNQUFNOztBQUVsQixhQUFPO0lBQ1g7QUFLQSxhQUFTLE9BQU8sUUFBWSxNQUFJO0FBQzVCLFlBQU0sVUFBVSxNQUFNLEtBQUssV0FBVyxDQUFDLEVBQUUsUUFBUSxTQUFVLFFBQU07QUFDN0QsWUFBSSxRQUFRO0FBQ1IsbUJBQVMsT0FBTyxRQUFRO0FBQ3BCLGdCQUFJLEdBQUcsSUFBSSxPQUFPLEdBQUc7OztNQUdqQyxDQUFDO0FBQ0QsYUFBTztJQUNYO0FBS0EsYUFBUyxlQUFZO0FBQ2pCLGFBQU8sS0FBSyxNQUFNLEtBQUssT0FBTSxJQUFLLElBQVc7SUFDakQ7QUFFQSxRQUFNLGVBQWMsR0FBQSxPQUFBLFdBQVUsZ0JB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
