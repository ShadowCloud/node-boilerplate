var requirejs, require, define;

(function(undef) {
    function normalize(name, baseName) {
        var baseParts = baseName && baseName.split("/"), map = config.map, starMap = map && map["*"] || {}, nameParts, nameSegment, mapValue, foundMap, i, j, part;
        if (name && name.charAt(0) === "." && baseName) {
            baseParts = baseParts.slice(0, baseParts.length - 1), name = baseParts.concat(name.split("/"));
            for (i = 0; part = name[i]; i++) if (part === ".") name.splice(i, 1), i -= 1; else if (part === "..") {
                if (i === 1 && (name[2] === ".." || name[0] === "..")) return !0;
                i > 0 && (name.splice(i - 1, 2), i -= 2);
            }
            name = name.join("/");
        }
        if ((baseParts || starMap) && map) {
            nameParts = name.split("/");
            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");
                if (baseParts) for (j = baseParts.length; j > 0; j -= 1) {
                    mapValue = map[baseParts.slice(0, j).join("/")];
                    if (mapValue) {
                        mapValue = mapValue[nameSegment];
                        if (mapValue) {
                            foundMap = mapValue;
                            break;
                        }
                    }
                }
                foundMap = foundMap || starMap[nameSegment];
                if (foundMap) {
                    nameParts.splice(0, i, foundMap), name = nameParts.join("/");
                    break;
                }
            }
        }
        return name;
    }
    function makeRequire(relName, forceSync) {
        return function() {
            return req.apply(undef, aps.call(arguments, 0).concat([ relName, forceSync ]));
        };
    }
    function makeNormalize(relName) {
        return function(name) {
            return normalize(name, relName);
        };
    }
    function makeLoad(depName) {
        return function(value) {
            defined[depName] = value;
        };
    }
    function callDep(name) {
        if (waiting.hasOwnProperty(name)) {
            var args = waiting[name];
            delete waiting[name], defining[name] = !0, main.apply(undef, args);
        }
        if (!defined.hasOwnProperty(name)) throw new Error("No " + name);
        return defined[name];
    }
    function makeMap(name, relName) {
        var prefix, plugin, index = name.indexOf("!");
        return index !== -1 ? (prefix = normalize(name.slice(0, index), relName), name = name.slice(index + 1), plugin = callDep(prefix), plugin && plugin.normalize ? name = plugin.normalize(name, makeNormalize(relName)) : name = normalize(name, relName)) : name = normalize(name, relName), {
            f: prefix ? prefix + "!" + name : name,
            n: name,
            p: plugin
        };
    }
    function makeConfig(name) {
        return function() {
            return config && config.config && config.config[name] || {};
        };
    }
    var defined = {}, waiting = {}, config = {}, defining = {}, aps = [].slice, main, req;
    main = function(name, deps, callback, relName) {
        var args = [], usingExports, cjsModule, depName, ret, map, i;
        relName = relName || name;
        if (typeof callback == "function") {
            deps = !deps.length && callback.length ? [ "require", "exports", "module" ] : deps;
            for (i = 0; i < deps.length; i++) {
                map = makeMap(deps[i], relName), depName = map.f;
                if (depName === "require") args[i] = makeRequire(name); else if (depName === "exports") args[i] = defined[name] = {}, usingExports = !0; else if (depName === "module") cjsModule = args[i] = {
                    id: name,
                    uri: "",
                    exports: defined[name],
                    config: makeConfig(name)
                }; else if (defined.hasOwnProperty(depName) || waiting.hasOwnProperty(depName)) args[i] = callDep(depName); else if (map.p) map.p.load(map.n, makeRequire(relName, !0), makeLoad(depName), {}), args[i] = defined[depName]; else if (!defining[depName]) throw new Error(name + " missing " + depName);
            }
            ret = callback.apply(defined[name], args);
            if (name) if (cjsModule && cjsModule.exports !== undef && cjsModule.exports !== defined[name]) defined[name] = cjsModule.exports; else if (ret !== undef || !usingExports) defined[name] = ret;
        } else name && (defined[name] = callback);
    }, requirejs = require = req = function(deps, callback, relName, forceSync) {
        return typeof deps == "string" ? callDep(makeMap(deps, callback).f) : (deps.splice || (config = deps, callback.splice ? (deps = callback, callback = relName, relName = null) : deps = undef), callback = callback || function() {}, forceSync ? main(undef, deps, callback, relName) : setTimeout(function() {
            main(undef, deps, callback, relName);
        }, 15), req);
    }, req.config = function(cfg) {
        return config = cfg, req;
    }, define = function(name, deps, callback) {
        deps.splice || (callback = deps, deps = []), waiting[name] = [ name, deps, callback ];
    }, define.amd = {
        jQuery: !0
    };
})(), define("libs/almond", function() {}), define("app", [ "require", "exports", "module" ], function(require, exports, module) {
    function App() {}
    App.prototype.start = function() {
        console.log("Application Started.");
    }, module.exports = App;
}), define("main", [ "require", "exports", "module", "app" ], function(require, exports, module) {
    var App = require("app"), app = new App;
    app.start();
}), require([ "main" ]);;