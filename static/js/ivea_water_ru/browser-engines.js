(function () {
  var document = this.document;
  var window = (document.window = this);

  var ua = navigator.userAgent.toLowerCase(),
    platform = navigator.platform.toLowerCase(),
    UA = ua.match(
      /(opera|ie|trident|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|rv:(\d.?)|$)/
    ) || [null, "unknown", 0],
    mode = (UA[1] == "ie" || UA[1] == "trident") && document.documentMode;

  var Browser = (this.Browser = {
    extend: Function.prototype.extend,

    name: UA[1] == "version" ? UA[3] : UA[1] == "trident" ? "ie" : UA[1],

    version:
      mode ||
      parseFloat(
        UA[1] == "opera" && UA[4]
          ? UA[4]
          : UA[1] == "trident" && UA[5]
          ? UA[5]
          : UA[2]
      ),

    Platform: {
      name: ua.match(/ip(?:ad|od|hone)/)
        ? "ios"
        : (ua.match(/(?:webos|android)/) ||
            platform.match(/mac|win|linux/) || ["other"])[0],
    },

    Features: {
      xpath: !!document.evaluate,
      air: !!window.runtime,
      query: !!document.querySelector,
      json: !!window.JSON,
    },

    Plugins: {},
  });

  Browser[Browser.name] = true;
  Browser[Browser.name + parseInt(Browser.version, 10)] = true;
  Browser.Platform[Browser.Platform.name] = true;

  // Request

  Browser.Request = (function () {
    var XMLHTTP = function () {
      return new XMLHttpRequest();
    };

    var MSXML2 = function () {
      return new ActiveXObject("MSXML2.XMLHTTP");
    };

    var MSXML = function () {
      return new ActiveXObject("Microsoft.XMLHTTP");
    };

    return Function.attempt(
      function () {
        XMLHTTP();
        return XMLHTTP;
      },
      function () {
        MSXML2();
        return MSXML2;
      },
      function () {
        MSXML();
        return MSXML;
      }
    );
  })();

  Browser.Features.xhr = !!Browser.Request;

  //<1.4compat>

  // Flash detection

  var version = (
    Function.attempt(
      function () {
        return navigator.plugins["Shockwave Flash"].description;
      },
      function () {
        return new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable(
          "$version"
        );
      }
    ) || "0 r0"
  ).match(/\d+/g);

  Browser.Plugins.Flash = {
    version: Number(version[0] || "0." + version[1]) || 0,
    build: Number(version[2]) || 0,
  };

  //</1.4compat>

  // String scripts

  Browser.exec = function (text) {
    if (!text) return text;
    if (window.execScript) {
      window.execScript(text);
    } else {
      var script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.text = text;
      document.head.appendChild(script);
      document.head.removeChild(script);
    }
    return text;
  };

  if (Browser.Platform.ios) Browser.Platform.ipod = true;

  Browser.Engine = {};

  var setEngine = function (name, version) {
    Browser.Engine.name = name;
    Browser.Engine[name + version] = true;
    Browser.Engine.version = version;
  };

  if (Browser.ie) {
    Browser.Engine.trident = true;

    switch (Browser.version) {
      case 6:
        setEngine("trident", 4);
        break;
      case 7:
        setEngine("trident", 5);
        break;
      case 8:
        setEngine("trident", 6);
    }
  }

  if (Browser.firefox) {
    Browser.Engine.gecko = true;

    if (Browser.version >= 3) setEngine("gecko", 19);
    else setEngine("gecko", 18);
  }

  if (Browser.safari || Browser.chrome) {
    Browser.Engine.webkit = true;

    switch (Browser.version) {
      case 2:
        setEngine("webkit", 419);
        break;
      case 3:
        setEngine("webkit", 420);
        break;
      case 4:
        setEngine("webkit", 525);
    }
  }

  if (Browser.opera) {
    Browser.Engine.presto = true;

    if (Browser.version >= 9.6) setEngine("presto", 960);
    else if (Browser.version >= 9.5) setEngine("presto", 950);
    else setEngine("presto", 925);
  }

  if (Browser.name == "unknown") {
    switch ((ua.match(/(?:webkit|khtml|gecko)/) || [])[0]) {
      case "webkit":
      case "khtml":
        Browser.Engine.webkit = true;
        break;
      case "gecko":
        Browser.Engine.gecko = true;
    }
  }

  this.$exec = Browser.exec;

  //</1.2compat>
})();
