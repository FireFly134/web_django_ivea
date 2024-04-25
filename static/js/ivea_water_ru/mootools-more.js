// MooTools: the javascript framework.
// Load this file's selection again by visiting: http://mootools.net/more/065f2f092ece4e3b32bb5214464cf926
// Or build this file again with packager using: packager build More/More More/Events.Pseudos More/Class.Refactor More/Class.Binds More/Class.Occlude More/Chain.Wait More/Array.Extras More/Date More/Date.Extras More/Number.Format More/Object.Extras More/String.Extras More/String.QueryString More/URI More/URI.Relative More/Hash More/Hash.Extras More/Element.Forms More/Elements.From More/Element.Event.Pseudos More/Element.Event.Pseudos.Keys More/Element.Measure More/Element.Pin More/Element.Position More/Element.Shortcuts More/Form.Request More/Form.Request.Append More/Form.Validator More/Form.Validator.Inline More/Form.Validator.Extras More/OverText More/Fx.Elements More/Fx.Accordion More/Fx.Move More/Fx.Reveal More/Fx.Scroll More/Fx.Slide More/Fx.SmoothScroll More/Fx.Sort More/Drag More/Drag.Move More/Slider More/Sortables More/Request.JSONP More/Request.Queue More/Request.Periodical More/Assets More/Color More/Group More/Hash.Cookie More/IframeShim More/Table More/HtmlTable More/HtmlTable.Zebra More/HtmlTable.Sort More/HtmlTable.Select More/Keyboard More/Keyboard.Extras More/Mask More/Scroller More/Tips More/Spinner More/Locale More/Locale.Set.From More/Locale.en-US.Date More/Locale.en-US.Form.Validator More/Locale.en-US.Number More/Locale.ar.Date More/Locale.ar.Form.Validator More/Locale.ca-CA.Date More/Locale.ca-CA.Form.Validator More/Locale.cs-CZ.Date More/Locale.cs-CZ.Form.Validator More/Locale.da-DK.Date More/Locale.da-DK.Form.Validator More/Locale.de-CH.Date More/Locale.de-CH.Form.Validator More/Locale.de-DE.Date More/Locale.de-DE.Form.Validator More/Locale.de-DE.Number More/Locale.en-GB.Date More/Locale.es-AR.Date More/Locale.es-AR.Form.Validator More/Locale.es-ES.Date More/Locale.es-ES.Form.Validator More/Locale.et-EE.Date More/Locale.et-EE.Form.Validator More/Locale.EU.Number More/Locale.fa.Date More/Locale.fa.Form.Validator More/Locale.fi-FI.Date More/Locale.fi-FI.Form.Validator More/Locale.fi-FI.Number More/Locale.fr-FR.Date More/Locale.fr-FR.Form.Validator More/Locale.fr-FR.Number More/Locale.he-IL.Date More/Locale.he-IL.Form.Validator More/Locale.he-IL.Number More/Locale.hu-HU.Date More/Locale.hu-HU.Form.Validator More/Locale.it-IT.Date More/Locale.it-IT.Form.Validator More/Locale.ja-JP.Date More/Locale.ja-JP.Form.Validator More/Locale.ja-JP.Number More/Locale.nl-NL.Date More/Locale.nl-NL.Form.Validator More/Locale.nl-NL.Number More/Locale.no-NO.Date More/Locale.no-NO.Form.Validator More/Locale.pl-PL.Date More/Locale.pl-PL.Form.Validator More/Locale.pt-BR.Date More/Locale.pt-BR.Form.Validator More/Locale.pt-PT.Date More/Locale.pt-PT.Form.Validator More/Locale.ru-RU-unicode.Date More/Locale.ru-RU-unicode.Form.Validator More/Locale.si-SI.Date More/Locale.si-SI.Form.Validator More/Locale.sv-SE.Date More/Locale.sv-SE.Form.Validator More/Locale.uk-UA.Date More/Locale.uk-UA.Form.Validator More/Locale.zh-CH.Date More/Locale.zh-CH.Form.Validator
/*
---
copyrights:
  - [MooTools](http://mootools.net)

licenses:
  - [MIT License](http://mootools.net/license.txt)
...
*/
MooTools.More = {
  version: "1.4.0.1",
  build: "a4244edf2aa97ac8a196fc96082dd35af1abab87",
};
(function () {
  Events.Pseudos = function (h, e, f) {
    var d = "_monitorEvents:";
    var c = function (i) {
      return {
        store: i.store
          ? function (j, k) {
              i.store(d + j, k);
            }
          : function (j, k) {
              (i._monitorEvents || (i._monitorEvents = {}))[j] = k;
            },
        retrieve: i.retrieve
          ? function (j, k) {
              return i.retrieve(d + j, k);
            }
          : function (j, k) {
              if (!i._monitorEvents) {
                return k;
              }
              return i._monitorEvents[j] || k;
            },
      };
    };
    var g = function (k) {
      if (k.indexOf(":") == -1 || !h) {
        return null;
      }
      var j = Slick.parse(k).expressions[0][0],
        p = j.pseudos,
        i = p.length,
        o = [];
      while (i--) {
        var n = p[i].key,
          m = h[n];
        if (m != null) {
          o.push({
            event: j.tag,
            value: p[i].value,
            pseudo: n,
            original: k,
            listener: m,
          });
        }
      }
      return o.length ? o : null;
    };
    return {
      addEvent: function (m, p, j) {
        var n = g(m);
        if (!n) {
          return e.call(this, m, p, j);
        }
        var k = c(this),
          r = k.retrieve(m, []),
          i = n[0].event,
          l = Array.slice(arguments, 2),
          o = p,
          q = this;
        n.each(function (s) {
          var t = s.listener,
            u = o;
          if (t == false) {
            i += ":" + s.pseudo + "(" + s.value + ")";
          } else {
            o = function () {
              t.call(q, s, u, arguments, o);
            };
          }
        });
        r.include({ type: i, event: p, monitor: o });
        k.store(m, r);
        if (m != i) {
          e.apply(this, [m, p].concat(l));
        }
        return e.apply(this, [i, o].concat(l));
      },
      removeEvent: function (m, l) {
        var k = g(m);
        if (!k) {
          return f.call(this, m, l);
        }
        var n = c(this),
          j = n.retrieve(m);
        if (!j) {
          return this;
        }
        var i = Array.slice(arguments, 2);
        f.apply(this, [m, l].concat(i));
        j.each(function (o, p) {
          if (!l || o.event == l) {
            f.apply(this, [o.type, o.monitor].concat(i));
          }
          delete j[p];
        }, this);
        n.store(m, j);
        return this;
      },
    };
  };
  var b = {
    once: function (e, f, d, c) {
      f.apply(this, d);
      this.removeEvent(e.event, c).removeEvent(e.original, f);
    },
    throttle: function (d, e, c) {
      if (!e._throttled) {
        e.apply(this, c);
        e._throttled = setTimeout(function () {
          e._throttled = false;
        }, d.value || 250);
      }
    },
    pause: function (d, e, c) {
      clearTimeout(e._pause);
      e._pause = e.delay(d.value || 250, this, c);
    },
  };
  Events.definePseudo = function (c, d) {
    b[c] = d;
    return this;
  };
  Events.lookupPseudo = function (c) {
    return b[c];
  };
  var a = Events.prototype;
  Events.implement(Events.Pseudos(b, a.addEvent, a.removeEvent));
  ["Request", "Fx"].each(function (c) {
    if (this[c]) {
      this[c].implement(Events.prototype);
    }
  });
})();
Class.refactor = function (b, a) {
  Object.each(a, function (e, d) {
    var c = b.prototype[d];
    c = (c && c.$origin) || c || function () {};
    b.implement(
      d,
      typeof e == "function"
        ? function () {
            var f = this.previous;
            this.previous = c;
            var g = e.apply(this, arguments);
            this.previous = f;
            return g;
          }
        : e
    );
  });
  return b;
};
Class.Mutators.Binds = function (a) {
  if (!this.prototype.initialize) {
    this.implement("initialize", function () {});
  }
  return Array.from(a).concat(this.prototype.Binds || []);
};
Class.Mutators.initialize = function (a) {
  return function () {
    Array.from(this.Binds).each(function (b) {
      var c = this[b];
      if (c) {
        this[b] = c.bind(this);
      }
    }, this);
    return a.apply(this, arguments);
  };
};
Class.Occlude = new Class({
  occlude: function (c, b) {
    b = document.id(b || this.element);
    var a = b.retrieve(c || this.property);
    if (a && !this.occluded) {
      return (this.occluded = a);
    }
    this.occluded = false;
    b.store(c || this.property, this);
    return this.occluded;
  },
});
(function () {
  var a = {
    wait: function (b) {
      return this.chain(
        function () {
          this.callChain.delay(b == null ? 500 : b, this);
          return this;
        }.bind(this)
      );
    },
  };
  Chain.implement(a);
  if (this.Fx) {
    Fx.implement(a);
  }
  if (this.Element && Element.implement && this.Fx) {
    Element.implement({
      chains: function (b) {
        Array.from(b || ["tween", "morph", "reveal"]).each(function (c) {
          c = this.get(c);
          if (!c) {
            return;
          }
          c.setOptions({ link: "chain" });
        }, this);
        return this;
      },
      pauseFx: function (c, b) {
        this.chains(b)
          .get(b || "tween")
          .wait(c);
        return this;
      },
    });
  }
})();
(function (a) {
  Array.implement({
    min: function () {
      return Math.min.apply(null, this);
    },
    max: function () {
      return Math.max.apply(null, this);
    },
    average: function () {
      return this.length ? this.sum() / this.length : 0;
    },
    sum: function () {
      var b = 0,
        c = this.length;
      if (c) {
        while (c--) {
          b += this[c];
        }
      }
      return b;
    },
    unique: function () {
      return [].combine(this);
    },
    shuffle: function () {
      for (var c = this.length; c && --c; ) {
        var b = this[c],
          d = Math.floor(Math.random() * (c + 1));
        this[c] = this[d];
        this[d] = b;
      }
      return this;
    },
    reduce: function (d, e) {
      for (var c = 0, b = this.length; c < b; c++) {
        if (c in this) {
          e = e === a ? this[c] : d.call(null, e, this[c], c, this);
        }
      }
      return e;
    },
    reduceRight: function (c, d) {
      var b = this.length;
      while (b--) {
        if (b in this) {
          d = d === a ? this[b] : c.call(null, d, this[b], b, this);
        }
      }
      return d;
    },
  });
})();
(function () {
  var b = function (c) {
    return c != null;
  };
  var a = Object.prototype.hasOwnProperty;
  Object.extend({
    getFromPath: function (e, f) {
      if (typeof f == "string") {
        f = f.split(".");
      }
      for (var d = 0, c = f.length; d < c; d++) {
        if (a.call(e, f[d])) {
          e = e[f[d]];
        } else {
          return null;
        }
      }
      return e;
    },
    cleanValues: function (c, e) {
      e = e || b;
      for (var d in c) {
        if (!e(c[d])) {
          delete c[d];
        }
      }
      return c;
    },
    erase: function (c, d) {
      if (a.call(c, d)) {
        delete c[d];
      }
      return c;
    },
    run: function (d) {
      var c = Array.slice(arguments, 1);
      for (var e in d) {
        if (d[e].apply) {
          d[e].apply(d, c);
        }
      }
      return d;
    },
  });
})();
(function () {
  var b = null,
    a = {},
    d = {};
  var c = function (f) {
    if (instanceOf(f, e.Set)) {
      return f;
    } else {
      return a[f];
    }
  };
  var e = (this.Locale = {
    define: function (f, j, h, i) {
      var g;
      if (instanceOf(f, e.Set)) {
        g = f.name;
        if (g) {
          a[g] = f;
        }
      } else {
        g = f;
        if (!a[g]) {
          a[g] = new e.Set(g);
        }
        f = a[g];
      }
      if (j) {
        f.define(j, h, i);
      }
      if (!b) {
        b = f;
      }
      return f;
    },
    use: function (f) {
      f = c(f);
      if (f) {
        b = f;
        this.fireEvent("change", f);
      }
      return this;
    },
    getCurrent: function () {
      return b;
    },
    get: function (g, f) {
      return b ? b.get(g, f) : "";
    },
    inherit: function (f, g, h) {
      f = c(f);
      if (f) {
        f.inherit(g, h);
      }
      return this;
    },
    list: function () {
      return Object.keys(a);
    },
  });
  Object.append(e, new Events());
  e.Set = new Class({
    sets: {},
    inherits: { locales: [], sets: {} },
    initialize: function (f) {
      this.name = f || "";
    },
    define: function (i, g, h) {
      var f = this.sets[i];
      if (!f) {
        f = {};
      }
      if (g) {
        if (typeOf(g) == "object") {
          f = Object.merge(f, g);
        } else {
          f[g] = h;
        }
      }
      this.sets[i] = f;
      return this;
    },
    get: function (r, j, q) {
      var p = Object.getFromPath(this.sets, r);
      if (p != null) {
        var m = typeOf(p);
        if (m == "function") {
          p = p.apply(null, Array.from(j));
        } else {
          if (m == "object") {
            p = Object.clone(p);
          }
        }
        return p;
      }
      var h = r.indexOf("."),
        o = h < 0 ? r : r.substr(0, h),
        k = (this.inherits.sets[o] || [])
          .combine(this.inherits.locales)
          .include("en-US");
      if (!q) {
        q = [];
      }
      for (var g = 0, f = k.length; g < f; g++) {
        if (q.contains(k[g])) {
          continue;
        }
        q.include(k[g]);
        var n = a[k[g]];
        if (!n) {
          continue;
        }
        p = n.get(r, j, q);
        if (p != null) {
          return p;
        }
      }
      return "";
    },
    inherit: function (g, h) {
      g = Array.from(g);
      if (h && !this.inherits.sets[h]) {
        this.inherits.sets[h] = [];
      }
      var f = g.length;
      while (f--) {
        (h ? this.inherits.sets[h] : this.inherits.locales).unshift(g[f]);
      }
      return this;
    },
  });
})();
Locale.define("en-US", "Date", {
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  months_abbr: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  days: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  days_abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  dateOrder: ["month", "date", "year"],
  shortDate: "%m/%d/%Y",
  shortTime: "%I:%M%p",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 0,
  ordinal: function (a) {
    return a > 3 && a < 21
      ? "th"
      : ["th", "st", "nd", "rd", "th"][Math.min(a % 10, 4)];
  },
  lessThanMinuteAgo: "less than a minute ago",
  minuteAgo: "about a minute ago",
  minutesAgo: "{delta} minutes ago",
  hourAgo: "about an hour ago",
  hoursAgo: "about {delta} hours ago",
  dayAgo: "1 day ago",
  daysAgo: "{delta} days ago",
  weekAgo: "1 week ago",
  weeksAgo: "{delta} weeks ago",
  monthAgo: "1 month ago",
  monthsAgo: "{delta} months ago",
  yearAgo: "1 year ago",
  yearsAgo: "{delta} years ago",
  lessThanMinuteUntil: "less than a minute from now",
  minuteUntil: "about a minute from now",
  minutesUntil: "{delta} minutes from now",
  hourUntil: "about an hour from now",
  hoursUntil: "about {delta} hours from now",
  dayUntil: "1 day from now",
  daysUntil: "{delta} days from now",
  weekUntil: "1 week from now",
  weeksUntil: "{delta} weeks from now",
  monthUntil: "1 month from now",
  monthsUntil: "{delta} months from now",
  yearUntil: "1 year from now",
  yearsUntil: "{delta} years from now",
});
(function () {
  var a = this.Date;
  var f = (a.Methods = {
    ms: "Milliseconds",
    year: "FullYear",
    min: "Minutes",
    mo: "Month",
    sec: "Seconds",
    hr: "Hours",
  });
  [
    "Date",
    "Day",
    "FullYear",
    "Hours",
    "Milliseconds",
    "Minutes",
    "Month",
    "Seconds",
    "Time",
    "TimezoneOffset",
    "Week",
    "Timezone",
    "GMTOffset",
    "DayOfYear",
    "LastMonth",
    "LastDayOfMonth",
    "UTCDate",
    "UTCDay",
    "UTCFullYear",
    "AMPM",
    "Ordinal",
    "UTCHours",
    "UTCMilliseconds",
    "UTCMinutes",
    "UTCMonth",
    "UTCSeconds",
    "UTCMilliseconds",
  ].each(function (s) {
    a.Methods[s.toLowerCase()] = s;
  });
  var p = function (u, t, s) {
    if (t == 1) {
      return u;
    }
    return u < Math.pow(10, t - 1) ? (s || "0") + p(u, t - 1, s) : u;
  };
  a.implement({
    set: function (u, s) {
      u = u.toLowerCase();
      var t = f[u] && "set" + f[u];
      if (t && this[t]) {
        this[t](s);
      }
      return this;
    }.overloadSetter(),
    get: function (t) {
      t = t.toLowerCase();
      var s = f[t] && "get" + f[t];
      if (s && this[s]) {
        return this[s]();
      }
      return null;
    }.overloadGetter(),
    clone: function () {
      return new a(this.get("time"));
    },
    increment: function (s, u) {
      s = s || "day";
      u = u != null ? u : 1;
      switch (s) {
        case "year":
          return this.increment("month", u * 12);
        case "month":
          var t = this.get("date");
          this.set("date", 1).set("mo", this.get("mo") + u);
          return this.set("date", t.min(this.get("lastdayofmonth")));
        case "week":
          return this.increment("day", u * 7);
        case "day":
          return this.set("date", this.get("date") + u);
      }
      if (!a.units[s]) {
        throw new Error(s + " is not a supported interval");
      }
      return this.set("time", this.get("time") + u * a.units[s]());
    },
    decrement: function (s, t) {
      return this.increment(s, -1 * (t != null ? t : 1));
    },
    isLeapYear: function () {
      return a.isLeapYear(this.get("year"));
    },
    clearTime: function () {
      return this.set({ hr: 0, min: 0, sec: 0, ms: 0 });
    },
    diff: function (t, s) {
      if (typeOf(t) == "string") {
        t = a.parse(t);
      }
      return ((t - this) / a.units[s || "day"](3, 3)).round();
    },
    getLastDayOfMonth: function () {
      return a.daysInMonth(this.get("mo"), this.get("year"));
    },
    getDayOfYear: function () {
      return (
        (a.UTC(this.get("year"), this.get("mo"), this.get("date") + 1) -
          a.UTC(this.get("year"), 0, 1)) /
        a.units.day()
      );
    },
    setDay: function (t, s) {
      if (s == null) {
        s = a.getMsg("firstDayOfWeek");
        if (s === "") {
          s = 1;
        }
      }
      t = (7 + a.parseDay(t, true) - s) % 7;
      var u = (7 + this.get("day") - s) % 7;
      return this.increment("day", t - u);
    },
    getWeek: function (v) {
      if (v == null) {
        v = a.getMsg("firstDayOfWeek");
        if (v === "") {
          v = 1;
        }
      }
      var x = this,
        u = (7 + x.get("day") - v) % 7,
        t = 0,
        w;
      if (v == 1) {
        var y = x.get("month"),
          s = x.get("date") - u;
        if (y == 11 && s > 28) {
          return 1;
        }
        if (y == 0 && s < -2) {
          x = new a(x).decrement("day", u);
          u = 0;
        }
        w = new a(x.get("year"), 0, 1).get("day") || 7;
        if (w > 4) {
          t = -7;
        }
      } else {
        w = new a(x.get("year"), 0, 1).get("day");
      }
      t += x.get("dayofyear");
      t += 6 - u;
      t += (7 + w - v) % 7;
      return t / 7;
    },
    getOrdinal: function (s) {
      return a.getMsg("ordinal", s || this.get("date"));
    },
    getTimezone: function () {
      return this.toString()
        .replace(/^.*? ([A-Z]{3}).[0-9]{4}.*$/, "$1")
        .replace(
          /^.*?\(([A-Z])[a-z]+ ([A-Z])[a-z]+ ([A-Z])[a-z]+\)$/,
          "$1$2$3"
        );
    },
    getGMTOffset: function () {
      var s = this.get("timezoneOffset");
      return (s > 0 ? "-" : "+") + p((s.abs() / 60).floor(), 2) + p(s % 60, 2);
    },
    setAMPM: function (s) {
      s = s.toUpperCase();
      var t = this.get("hr");
      if (t > 11 && s == "AM") {
        return this.decrement("hour", 12);
      } else {
        if (t < 12 && s == "PM") {
          return this.increment("hour", 12);
        }
      }
      return this;
    },
    getAMPM: function () {
      return this.get("hr") < 12 ? "AM" : "PM";
    },
    parse: function (s) {
      this.set("time", a.parse(s));
      return this;
    },
    isValid: function (s) {
      if (!s) {
        s = this;
      }
      return typeOf(s) == "date" && !isNaN(s.valueOf());
    },
    format: function (s) {
      if (!this.isValid()) {
        return "invalid date";
      }
      if (!s) {
        s = "%x %X";
      }
      if (typeof s == "string") {
        s = g[s.toLowerCase()] || s;
      }
      if (typeof s == "function") {
        return s(this);
      }
      var t = this;
      return s.replace(/%([a-z%])/gi, function (v, u) {
        switch (u) {
          case "a":
            return a.getMsg("days_abbr")[t.get("day")];
          case "A":
            return a.getMsg("days")[t.get("day")];
          case "b":
            return a.getMsg("months_abbr")[t.get("month")];
          case "B":
            return a.getMsg("months")[t.get("month")];
          case "c":
            return t.format("%a %b %d %H:%M:%S %Y");
          case "d":
            return p(t.get("date"), 2);
          case "e":
            return p(t.get("date"), 2, " ");
          case "H":
            return p(t.get("hr"), 2);
          case "I":
            return p(t.get("hr") % 12 || 12, 2);
          case "j":
            return p(t.get("dayofyear"), 3);
          case "k":
            return p(t.get("hr"), 2, " ");
          case "l":
            return p(t.get("hr") % 12 || 12, 2, " ");
          case "L":
            return p(t.get("ms"), 3);
          case "m":
            return p(t.get("mo") + 1, 2);
          case "M":
            return p(t.get("min"), 2);
          case "o":
            return t.get("ordinal");
          case "p":
            return a.getMsg(t.get("ampm"));
          case "s":
            return Math.round(t / 1000);
          case "S":
            return p(t.get("seconds"), 2);
          case "T":
            return t.format("%H:%M:%S");
          case "U":
            return p(t.get("week"), 2);
          case "w":
            return t.get("day");
          case "x":
            return t.format(a.getMsg("shortDate"));
          case "X":
            return t.format(a.getMsg("shortTime"));
          case "y":
            return t.get("year").toString().substr(2);
          case "Y":
            return t.get("year");
          case "z":
            return t.get("GMTOffset");
          case "Z":
            return t.get("Timezone");
        }
        return u;
      });
    },
    toISOString: function () {
      return this.format("iso8601");
    },
  }).alias({ toJSON: "toISOString", compare: "diff", strftime: "format" });
  var k = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    h = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
  var g = {
    db: "%Y-%m-%d %H:%M:%S",
    compact: "%Y%m%dT%H%M%S",
    short: "%d %b %H:%M",
    long: "%B %d, %Y %H:%M",
    rfc822: function (s) {
      return (
        k[s.get("day")] +
        s.format(", %d ") +
        h[s.get("month")] +
        s.format(" %Y %H:%M:%S %Z")
      );
    },
    rfc2822: function (s) {
      return (
        k[s.get("day")] +
        s.format(", %d ") +
        h[s.get("month")] +
        s.format(" %Y %H:%M:%S %z")
      );
    },
    iso8601: function (s) {
      return (
        s.getUTCFullYear() +
        "-" +
        p(s.getUTCMonth() + 1, 2) +
        "-" +
        p(s.getUTCDate(), 2) +
        "T" +
        p(s.getUTCHours(), 2) +
        ":" +
        p(s.getUTCMinutes(), 2) +
        ":" +
        p(s.getUTCSeconds(), 2) +
        "." +
        p(s.getUTCMilliseconds(), 3) +
        "Z"
      );
    },
  };
  var c = [],
    n = a.parse;
  var r = function (v, x, u) {
    var t = -1,
      w = a.getMsg(v + "s");
    switch (typeOf(x)) {
      case "object":
        t = w[x.get(v)];
        break;
      case "number":
        t = w[x];
        if (!t) {
          throw new Error("Invalid " + v + " index: " + x);
        }
        break;
      case "string":
        var s = w.filter(function (y) {
          return this.test(y);
        }, new RegExp("^" + x, "i"));
        if (!s.length) {
          throw new Error("Invalid " + v + " string");
        }
        if (s.length > 1) {
          throw new Error("Ambiguous " + v);
        }
        t = s[0];
    }
    return u ? w.indexOf(t) : t;
  };
  var i = 1900,
    o = 70;
  a.extend({
    getMsg: function (t, s) {
      return Locale.get("Date." + t, s);
    },
    units: {
      ms: Function.from(1),
      second: Function.from(1000),
      minute: Function.from(60000),
      hour: Function.from(3600000),
      day: Function.from(86400000),
      week: Function.from(608400000),
      month: function (t, s) {
        var u = new a();
        return (
          a.daysInMonth(
            t != null ? t : u.get("mo"),
            s != null ? s : u.get("year")
          ) * 86400000
        );
      },
      year: function (s) {
        s = s || new a().get("year");
        return a.isLeapYear(s) ? 31622400000 : 31536000000;
      },
    },
    daysInMonth: function (t, s) {
      return [
        31,
        a.isLeapYear(s) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ][t];
    },
    isLeapYear: function (s) {
      return (s % 4 === 0 && s % 100 !== 0) || s % 400 === 0;
    },
    parse: function (v) {
      var u = typeOf(v);
      if (u == "number") {
        return new a(v);
      }
      if (u != "string") {
        return v;
      }
      v = v.clean();
      if (!v.length) {
        return null;
      }
      var s;
      c.some(function (w) {
        var t = w.re.exec(v);
        return t ? (s = w.handler(t)) : false;
      });
      if (!(s && s.isValid())) {
        s = new a(n(v));
        if (!(s && s.isValid())) {
          s = new a(v.toInt());
        }
      }
      return s;
    },
    parseDay: function (s, t) {
      return r("day", s, t);
    },
    parseMonth: function (t, s) {
      return r("month", t, s);
    },
    parseUTC: function (t) {
      var s = new a(t);
      var u = a.UTC(
        s.get("year"),
        s.get("mo"),
        s.get("date"),
        s.get("hr"),
        s.get("min"),
        s.get("sec"),
        s.get("ms")
      );
      return new a(u);
    },
    orderIndex: function (s) {
      return a.getMsg("dateOrder").indexOf(s) + 1;
    },
    defineFormat: function (s, t) {
      g[s] = t;
      return this;
    },
    defineParser: function (s) {
      c.push(s.re && s.handler ? s : l(s));
      return this;
    },
    defineParsers: function () {
      Array.flatten(arguments).each(a.defineParser);
      return this;
    },
    define2DigitYearStart: function (s) {
      o = s % 100;
      i = s - o;
      return this;
    },
  }).extend({ defineFormats: a.defineFormat.overloadSetter() });
  var d = function (s) {
    return new RegExp(
      "(?:" +
        a
          .getMsg(s)
          .map(function (t) {
            return t.substr(0, 3);
          })
          .join("|") +
        ")[a-z]*"
    );
  };
  var m = function (s) {
    switch (s) {
      case "T":
        return "%H:%M:%S";
      case "x":
        return (
          (a.orderIndex("month") == 1 ? "%m[-./]%d" : "%d[-./]%m") +
          "([-./]%y)?"
        );
      case "X":
        return "%H([.:]%M)?([.:]%S([.:]%s)?)? ?%p? ?%z?";
    }
    return null;
  };
  var j = {
    d: /[0-2]?[0-9]|3[01]/,
    H: /[01]?[0-9]|2[0-3]/,
    I: /0?[1-9]|1[0-2]/,
    M: /[0-5]?\d/,
    s: /\d+/,
    o: /[a-z]*/,
    p: /[ap]\.?m\.?/,
    y: /\d{2}|\d{4}/,
    Y: /\d{4}/,
    z: /Z|[+-]\d{2}(?::?\d{2})?/,
  };
  j.m = j.I;
  j.S = j.M;
  var e;
  var b = function (s) {
    e = s;
    j.a = j.A = d("days");
    j.b = j.B = d("months");
    c.each(function (u, t) {
      if (u.format) {
        c[t] = l(u.format);
      }
    });
  };
  var l = function (u) {
    if (!e) {
      return { format: u };
    }
    var s = [];
    var t = (u.source || u)
      .replace(/%([a-z])/gi, function (w, v) {
        return m(v) || w;
      })
      .replace(/\((?!\?)/g, "(?:")
      .replace(/ (?!\?|\*)/g, ",? ")
      .replace(/%([a-z%])/gi, function (w, v) {
        var x = j[v];
        if (!x) {
          return v;
        }
        s.push(v);
        return "(" + x.source + ")";
      })
      .replace(/\[a-z\]/gi, "[a-z\\u00c0-\\uffff;&]");
    return {
      format: u,
      re: new RegExp("^" + t + "$", "i"),
      handler: function (y) {
        y = y.slice(1).associate(s);
        var v = new a().clearTime(),
          x = y.y || y.Y;
        if (x != null) {
          q.call(v, "y", x);
        }
        if ("d" in y) {
          q.call(v, "d", 1);
        }
        if ("m" in y || y.b || y.B) {
          q.call(v, "m", 1);
        }
        for (var w in y) {
          q.call(v, w, y[w]);
        }
        return v;
      },
    };
  };
  var q = function (s, t) {
    if (!t) {
      return this;
    }
    switch (s) {
      case "a":
      case "A":
        return this.set("day", a.parseDay(t, true));
      case "b":
      case "B":
        return this.set("mo", a.parseMonth(t, true));
      case "d":
        return this.set("date", t);
      case "H":
      case "I":
        return this.set("hr", t);
      case "m":
        return this.set("mo", t - 1);
      case "M":
        return this.set("min", t);
      case "p":
        return this.set("ampm", t.replace(/\./g, ""));
      case "S":
        return this.set("sec", t);
      case "s":
        return this.set("ms", ("0." + t) * 1000);
      case "w":
        return this.set("day", t);
      case "Y":
        return this.set("year", t);
      case "y":
        t = +t;
        if (t < 100) {
          t += i + (t < o ? 100 : 0);
        }
        return this.set("year", t);
      case "z":
        if (t == "Z") {
          t = "+00";
        }
        var u = t.match(/([+-])(\d{2}):?(\d{2})?/);
        u =
          (u[1] + "1") * (u[2] * 60 + (+u[3] || 0)) + this.getTimezoneOffset();
        return this.set("time", this - u * 60000);
    }
    return this;
  };
  a.defineParsers(
    "%Y([-./]%m([-./]%d((T| )%X)?)?)?",
    "%Y%m%d(T%H(%M%S?)?)?",
    "%x( %X)?",
    "%d%o( %b( %Y)?)?( %X)?",
    "%b( %d%o)?( %Y)?( %X)?",
    "%Y %b( %d%o( %X)?)?",
    "%o %b %d %X %z %Y",
    "%T",
    "%H:%M( ?%p)?"
  );
  Locale.addEvent("change", function (s) {
    if (Locale.get("Date")) {
      b(s);
    }
  }).fireEvent("change", Locale.getCurrent());
})();
Date.implement({
  timeDiffInWords: function (a) {
    return Date.distanceOfTimeInWords(this, a || new Date());
  },
  timeDiff: function (f, c) {
    if (f == null) {
      f = new Date();
    }
    var h = ((f - this) / 1000).floor().abs();
    var e = [],
      a = [60, 60, 24, 365, 0],
      d = ["s", "m", "h", "d", "y"],
      g,
      b;
    for (var i = 0; i < a.length; i++) {
      if (i && !h) {
        break;
      }
      g = h;
      if ((b = a[i])) {
        g = h % b;
        h = (h / b).floor();
      }
      e.unshift(g + (d[i] || ""));
    }
    return e.join(c || ":");
  },
})
  .extend({
    distanceOfTimeInWords: function (b, a) {
      return Date.getTimePhrase(((a - b) / 1000).toInt());
    },
    getTimePhrase: function (f) {
      var d = f < 0 ? "Until" : "Ago";
      if (f < 0) {
        f *= -1;
      }
      var b = {
        minute: 60,
        hour: 60,
        day: 24,
        week: 7,
        month: 52 / 12,
        year: 12,
        eon: Infinity,
      };
      var e = "lessThanMinute";
      for (var c in b) {
        var a = b[c];
        if (f < 1.5 * a) {
          if (f > 0.75 * a) {
            e = c;
          }
          break;
        }
        f /= a;
        e = c + "s";
      }
      f = f.round();
      return Date.getMsg(e + d, f).substitute({ delta: f });
    },
  })
  .defineParsers(
    {
      re: /^(?:tod|tom|yes)/i,
      handler: function (a) {
        var b = new Date().clearTime();
        switch (a[0]) {
          case "tom":
            return b.increment();
          case "yes":
            return b.decrement();
          default:
            return b;
        }
      },
    },
    {
      re: /^(next|last) ([a-z]+)$/i,
      handler: function (e) {
        var f = new Date().clearTime();
        var b = f.getDay();
        var c = Date.parseDay(e[2], true);
        var a = c - b;
        if (c <= b) {
          a += 7;
        }
        if (e[1] == "last") {
          a -= 7;
        }
        return f.set("date", f.getDate() + a);
      },
    }
  )
  .alias("timeAgoInWords", "timeDiffInWords");
Locale.define("en-US", "Number", {
  decimal: ".",
  group: ",",
  currency: { prefix: "$ " },
});
Number.implement({
  format: function (q) {
    var n = this;
    q = q ? Object.clone(q) : {};
    var a = function (i) {
      if (q[i] != null) {
        return q[i];
      }
      return Locale.get("Number." + i);
    };
    var f = n < 0,
      h = a("decimal"),
      k = a("precision"),
      o = a("group"),
      c = a("decimals");
    if (f) {
      var e = a("negative") || {};
      if (e.prefix == null && e.suffix == null) {
        e.prefix = "-";
      }
      ["prefix", "suffix"].each(function (i) {
        if (e[i]) {
          q[i] = a(i) + e[i];
        }
      });
      n = -n;
    }
    var l = a("prefix"),
      p = a("suffix");
    if (c !== "" && c >= 0 && c <= 20) {
      n = n.toFixed(c);
    }
    if (k >= 1 && k <= 21) {
      n = (+n).toPrecision(k);
    }
    n += "";
    var m;
    if (a("scientific") === false && n.indexOf("e") > -1) {
      var j = n.split("e"),
        b = +j[1];
      n = j[0].replace(".", "");
      if (b < 0) {
        b = -b - 1;
        m = j[0].indexOf(".");
        if (m > -1) {
          b -= m - 1;
        }
        while (b--) {
          n = "0" + n;
        }
        n = "0." + n;
      } else {
        m = j[0].lastIndexOf(".");
        if (m > -1) {
          b -= j[0].length - m - 1;
        }
        while (b--) {
          n += "0";
        }
      }
    }
    if (h != ".") {
      n = n.replace(".", h);
    }
    if (o) {
      m = n.lastIndexOf(h);
      m = m > -1 ? m : n.length;
      var d = n.substring(m),
        g = m;
      while (g--) {
        if ((m - g - 1) % 3 == 0 && g != m - 1) {
          d = o + d;
        }
        d = n.charAt(g) + d;
      }
      n = d;
    }
    if (l) {
      n = l + n;
    }
    if (p) {
      n += p;
    }
    return n;
  },
  formatCurrency: function (b) {
    var a = Locale.get("Number.currency") || {};
    if (a.scientific == null) {
      a.scientific = false;
    }
    a.decimals = b != null ? b : a.decimals == null ? 2 : a.decimals;
    return this.format(a);
  },
  formatPercentage: function (b) {
    var a = Locale.get("Number.percentage") || {};
    if (a.suffix == null) {
      a.suffix = "%";
    }
    a.decimals = b != null ? b : a.decimals == null ? 2 : a.decimals;
    return this.format(a);
  },
});
(function () {
  var c = {
      a: /[Г ГЎГўГЈГ¤ГҐДѓД…]/g,
      A: /[ГЂГЃГ‚ГѓГ„Г…Д‚Д„]/g,
      c: /[Д‡ДЌГ§]/g,
      C: /[Д†ДЊГ‡]/g,
      d: /[ДЏД‘]/g,
      D: /[ДЋГђ]/g,
      e: /[ГЁГ©ГЄГ«Д›Д™]/g,
      E: /[Г€Г‰ГЉГ‹ДљД]/g,
      g: /[Дџ]/g,
      G: /[Дћ]/g,
      i: /[Г¬Г­Г®ГЇ]/g,
      I: /[ГЊГЌГЋГЏ]/g,
      l: /[ДєДѕЕ‚]/g,
      L: /[Д№ДЅЕЃ]/g,
      n: /[Г±Е€Е„]/g,
      N: /[Г‘Е‡Еѓ]/g,
      o: /[ГІГіГґГµГ¶ГёЕ‘]/g,
      O: /[Г’Г“Г”Г•Г–Г]/g,
      r: /[Е™Е•]/g,
      R: /[ЕЕ”]/g,
      s: /[ЕЎЕЎЕџ]/g,
      S: /[Е ЕћЕљ]/g,
      t: /[ЕҐЕЈ]/g,
      T: /[Е¤Еў]/g,
      ue: /[Гј]/g,
      UE: /[Гњ]/g,
      u: /[Г№ГєГ»ЕЇВµ]/g,
      U: /[Г™ГљГ›Е®]/g,
      y: /[ГїГЅ]/g,
      Y: /[ЕёГќ]/g,
      z: /[ЕѕЕєЕј]/g,
      Z: /[ЕЅЕ№Е»]/g,
      th: /[Гѕ]/g,
      TH: /[Гћ]/g,
      dh: /[Г°]/g,
      DH: /[Гђ]/g,
      ss: /[Гџ]/g,
      oe: /[Е“]/g,
      OE: /[Е’]/g,
      ae: /[Г¦]/g,
      AE: /[Г†]/g,
    },
    b = {
      " ": /[\xa0\u2002\u2003\u2009]/g,
      "*": /[\xb7]/g,
      "'": /[\u2018\u2019]/g,
      '"': /[\u201c\u201d]/g,
      "...": /[\u2026]/g,
      "-": /[\u2013]/g,
      "&raquo;": /[\uFFFD]/g,
    };
  var a = function (f, h) {
    var e = f,
      g;
    for (g in h) {
      e = e.replace(h[g], g);
    }
    return e;
  };
  var d = function (e, g) {
    e = e || "";
    var h = g
        ? "<" + e + "(?!\\w)[^>]*>([\\s\\S]*?)</" + e + "(?!\\w)>"
        : "</?" + e + "([^>]+)?>",
      f = new RegExp(h, "gi");
    return f;
  };
  String.implement({
    standardize: function () {
      return a(this, c);
    },
    repeat: function (e) {
      return new Array(e + 1).join(this);
    },
    pad: function (e, h, g) {
      if (this.length >= e) {
        return this;
      }
      var f = (h == null ? " " : "" + h)
        .repeat(e - this.length)
        .substr(0, e - this.length);
      if (!g || g == "right") {
        return this + f;
      }
      if (g == "left") {
        return f + this;
      }
      return (
        f.substr(0, (f.length / 2).floor()) +
        this +
        f.substr(0, (f.length / 2).ceil())
      );
    },
    getTags: function (e, f) {
      return this.match(d(e, f)) || [];
    },
    stripTags: function (e, f) {
      return this.replace(d(e, f), "");
    },
    tidy: function () {
      return a(this, b);
    },
    truncate: function (e, f, i) {
      var h = this;
      if (f == null && arguments.length == 1) {
        f = "вЂ¦";
      }
      if (h.length > e) {
        h = h.substring(0, e);
        if (i) {
          var g = h.lastIndexOf(i);
          if (g != -1) {
            h = h.substr(0, g);
          }
        }
        if (f) {
          h += f;
        }
      }
      return h;
    },
  });
})();
String.implement({
  parseQueryString: function (d, a) {
    if (d == null) {
      d = true;
    }
    if (a == null) {
      a = true;
    }
    var c = this.split(/[&;]/),
      b = {};
    if (!c.length) {
      return b;
    }
    c.each(function (i) {
      var e = i.indexOf("=") + 1,
        g = e ? i.substr(e) : "",
        f = e ? i.substr(0, e - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [i],
        h = b;
      if (!f) {
        return;
      }
      if (a) {
        g = decodeURIComponent(g);
      }
      f.each(function (k, j) {
        if (d) {
          k = decodeURIComponent(k);
        }
        var l = h[k];
        if (j < f.length - 1) {
          h = h[k] = l || {};
        } else {
          if (typeOf(l) == "array") {
            l.push(g);
          } else {
            h[k] = l != null ? [l, g] : g;
          }
        }
      });
    });
    return b;
  },
  cleanQueryString: function (a) {
    return this.split("&")
      .filter(function (e) {
        var b = e.indexOf("="),
          c = b < 0 ? "" : e.substr(0, b),
          d = e.substr(b + 1);
        return a ? a.call(null, c, d) : d || d === 0;
      })
      .join("&");
  },
});
(function () {
  var b = function () {
    return this.get("value");
  };
  var a = (this.URI = new Class({
    Implements: Options,
    options: {},
    regex:
      /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/,
    parts: [
      "scheme",
      "user",
      "password",
      "host",
      "port",
      "directory",
      "file",
      "query",
      "fragment",
    ],
    schemes: { http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0 },
    initialize: function (d, c) {
      this.setOptions(c);
      var e = this.options.base || a.base;
      if (!d) {
        d = e;
      }
      if (d && d.parsed) {
        this.parsed = Object.clone(d.parsed);
      } else {
        this.set("value", d.href || d.toString(), e ? new a(e) : false);
      }
    },
    parse: function (e, d) {
      var c = e.match(this.regex);
      if (!c) {
        return false;
      }
      c.shift();
      return this.merge(c.associate(this.parts), d);
    },
    merge: function (d, c) {
      if ((!d || !d.scheme) && (!c || !c.scheme)) {
        return false;
      }
      if (c) {
        this.parts.every(function (e) {
          if (d[e]) {
            return false;
          }
          d[e] = c[e] || "";
          return true;
        });
      }
      d.port = d.port || this.schemes[d.scheme.toLowerCase()];
      d.directory = d.directory
        ? this.parseDirectory(d.directory, c ? c.directory : "")
        : "/";
      return d;
    },
    parseDirectory: function (d, e) {
      d = (d.substr(0, 1) == "/" ? "" : e || "/") + d;
      if (!d.test(a.regs.directoryDot)) {
        return d;
      }
      var c = [];
      d.replace(a.regs.endSlash, "")
        .split("/")
        .each(function (f) {
          if (f == ".." && c.length > 0) {
            c.pop();
          } else {
            if (f != ".") {
              c.push(f);
            }
          }
        });
      return c.join("/") + "/";
    },
    combine: function (c) {
      return (
        c.value ||
        c.scheme +
          "://" +
          (c.user ? c.user + (c.password ? ":" + c.password : "") + "@" : "") +
          (c.host || "") +
          (c.port && c.port != this.schemes[c.scheme] ? ":" + c.port : "") +
          (c.directory || "/") +
          (c.file || "") +
          (c.query ? "?" + c.query : "") +
          (c.fragment ? "#" + c.fragment : "")
      );
    },
    set: function (d, f, e) {
      if (d == "value") {
        var c = f.match(a.regs.scheme);
        if (c) {
          c = c[1];
        }
        if (c && this.schemes[c.toLowerCase()] == null) {
          this.parsed = { scheme: c, value: f };
        } else {
          this.parsed =
            this.parse(f, (e || this).parsed) ||
            (c ? { scheme: c, value: f } : { value: f });
        }
      } else {
        if (d == "data") {
          this.setData(f);
        } else {
          this.parsed[d] = f;
        }
      }
      return this;
    },
    get: function (c, d) {
      switch (c) {
        case "value":
          return this.combine(this.parsed, d ? d.parsed : false);
        case "data":
          return this.getData();
      }
      return this.parsed[c] || "";
    },
    go: function () {
      document.location.href = this.toString();
    },
    toURI: function () {
      return this;
    },
    getData: function (e, d) {
      var c = this.get(d || "query");
      if (!(c || c === 0)) {
        return e ? null : {};
      }
      var f = c.parseQueryString();
      return e ? f[e] : f;
    },
    setData: function (c, f, d) {
      if (typeof c == "string") {
        var e = this.getData();
        e[arguments[0]] = arguments[1];
        c = e;
      } else {
        if (f) {
          c = Object.merge(this.getData(), c);
        }
      }
      return this.set(d || "query", Object.toQueryString(c));
    },
    clearData: function (c) {
      return this.set(c || "query", "");
    },
    toString: b,
    valueOf: b,
  }));
  a.regs = { endSlash: /\/$/, scheme: /^(\w+):/, directoryDot: /\.\/|\.$/ };
  a.base = new a(
    Array.from(document.getElements("base[href]", true)).getLast(),
    { base: document.location }
  );
  String.implement({
    toURI: function (c) {
      return new a(this, c);
    },
  });
})();
URI = Class.refactor(URI, {
  combine: function (f, e) {
    if (!e || f.scheme != e.scheme || f.host != e.host || f.port != e.port) {
      return this.previous.apply(this, arguments);
    }
    var a =
      f.file +
      (f.query ? "?" + f.query : "") +
      (f.fragment ? "#" + f.fragment : "");
    if (!e.directory) {
      return (f.directory || (f.file ? "" : "./")) + a;
    }
    var d = e.directory.split("/"),
      c = f.directory.split("/"),
      g = "",
      h;
    var b = 0;
    for (h = 0; h < d.length && h < c.length && d[h] == c[h]; h++) {}
    for (b = 0; b < d.length - h - 1; b++) {
      g += "../";
    }
    for (b = h; b < c.length - 1; b++) {
      g += c[b] + "/";
    }
    return (g || (f.file ? "" : "./")) + a;
  },
  toAbsolute: function (a) {
    a = new URI(a);
    if (a) {
      a.set("directory", "").set("file", "");
    }
    return this.toRelative(a);
  },
  toRelative: function (a) {
    return this.get("value", new URI(a));
  },
});
(function () {
  if (this.Hash) {
    return;
  }
  var a = (this.Hash = new Type("Hash", function (b) {
    if (typeOf(b) == "hash") {
      b = Object.clone(b.getClean());
    }
    for (var c in b) {
      this[c] = b[c];
    }
    return this;
  }));
  this.$H = function (b) {
    return new a(b);
  };
  a.implement({
    forEach: function (b, c) {
      Object.forEach(this, b, c);
    },
    getClean: function () {
      var c = {};
      for (var b in this) {
        if (this.hasOwnProperty(b)) {
          c[b] = this[b];
        }
      }
      return c;
    },
    getLength: function () {
      var c = 0;
      for (var b in this) {
        if (this.hasOwnProperty(b)) {
          c++;
        }
      }
      return c;
    },
  });
  a.alias("each", "forEach");
  a.implement({
    has: Object.prototype.hasOwnProperty,
    keyOf: function (b) {
      return Object.keyOf(this, b);
    },
    hasValue: function (b) {
      return Object.contains(this, b);
    },
    extend: function (b) {
      a.each(
        b || {},
        function (d, c) {
          a.set(this, c, d);
        },
        this
      );
      return this;
    },
    combine: function (b) {
      a.each(
        b || {},
        function (d, c) {
          a.include(this, c, d);
        },
        this
      );
      return this;
    },
    erase: function (b) {
      if (this.hasOwnProperty(b)) {
        delete this[b];
      }
      return this;
    },
    get: function (b) {
      return this.hasOwnProperty(b) ? this[b] : null;
    },
    set: function (b, c) {
      if (!this[b] || this.hasOwnProperty(b)) {
        this[b] = c;
      }
      return this;
    },
    empty: function () {
      a.each(
        this,
        function (c, b) {
          delete this[b];
        },
        this
      );
      return this;
    },
    include: function (b, c) {
      if (this[b] == undefined) {
        this[b] = c;
      }
      return this;
    },
    map: function (b, c) {
      return new a(Object.map(this, b, c));
    },
    filter: function (b, c) {
      return new a(Object.filter(this, b, c));
    },
    every: function (b, c) {
      return Object.every(this, b, c);
    },
    some: function (b, c) {
      return Object.some(this, b, c);
    },
    getKeys: function () {
      return Object.keys(this);
    },
    getValues: function () {
      return Object.values(this);
    },
    toQueryString: function (b) {
      return Object.toQueryString(this, b);
    },
  });
  a.alias({ indexOf: "keyOf", contains: "hasValue" });
})();
Hash.implement({
  getFromPath: function (a) {
    return Object.getFromPath(this, a);
  },
  cleanValues: function (a) {
    return new Hash(Object.cleanValues(this, a));
  },
  run: function () {
    Object.run(arguments);
  },
});
Element.implement({
  tidy: function () {
    this.set("value", this.get("value").tidy());
  },
  getTextInRange: function (b, a) {
    return this.get("value").substring(b, a);
  },
  getSelectedText: function () {
    if (this.setSelectionRange) {
      return this.getTextInRange(
        this.getSelectionStart(),
        this.getSelectionEnd()
      );
    }
    return document.selection.createRange().text;
  },
  getSelectedRange: function () {
    if (this.selectionStart != null) {
      return { start: this.selectionStart, end: this.selectionEnd };
    }
    var e = { start: 0, end: 0 };
    var a = this.getDocument().selection.createRange();
    if (!a || a.parentElement() != this) {
      return e;
    }
    var c = a.duplicate();
    if (this.type == "text") {
      e.start = 0 - c.moveStart("character", -100000);
      e.end = e.start + a.text.length;
    } else {
      var b = this.get("value");
      var d = b.length;
      c.moveToElementText(this);
      c.setEndPoint("StartToEnd", a);
      if (c.text.length) {
        d -= b.match(/[\n\r]*$/)[0].length;
      }
      e.end = d - c.text.length;
      c.setEndPoint("StartToStart", a);
      e.start = d - c.text.length;
    }
    return e;
  },
  getSelectionStart: function () {
    return this.getSelectedRange().start;
  },
  getSelectionEnd: function () {
    return this.getSelectedRange().end;
  },
  setCaretPosition: function (a) {
    if (a == "end") {
      a = this.get("value").length;
    }
    this.selectRange(a, a);
    return this;
  },
  getCaretPosition: function () {
    return this.getSelectedRange().start;
  },
  selectRange: function (e, a) {
    if (this.setSelectionRange) {
      this.focus();
      this.setSelectionRange(e, a);
    } else {
      var c = this.get("value");
      var d = c.substr(e, a - e).replace(/\r/g, "").length;
      e = c.substr(0, e).replace(/\r/g, "").length;
      var b = this.createTextRange();
      b.collapse(true);
      b.moveEnd("character", e + d);
      b.moveStart("character", e);
      b.select();
    }
    return this;
  },
  insertAtCursor: function (b, a) {
    var d = this.getSelectedRange();
    var c = this.get("value");
    this.set(
      "value",
      c.substring(0, d.start) + b + c.substring(d.end, c.length)
    );
    if (a !== false) {
      this.selectRange(d.start, d.start + b.length);
    } else {
      this.setCaretPosition(d.start + b.length);
    }
    return this;
  },
  insertAroundCursor: function (b, a) {
    b = Object.append({ before: "", defaultMiddle: "", after: "" }, b);
    var c = this.getSelectedText() || b.defaultMiddle;
    var g = this.getSelectedRange();
    var f = this.get("value");
    if (g.start == g.end) {
      this.set(
        "value",
        f.substring(0, g.start) +
          b.before +
          c +
          b.after +
          f.substring(g.end, f.length)
      );
      this.selectRange(
        g.start + b.before.length,
        g.end + b.before.length + c.length
      );
    } else {
      var d = f.substring(g.start, g.end);
      this.set(
        "value",
        f.substring(0, g.start) +
          b.before +
          d +
          b.after +
          f.substring(g.end, f.length)
      );
      var e = g.start + b.before.length;
      if (a !== false) {
        this.selectRange(e, e + d.length);
      } else {
        this.setCaretPosition(e + f.length);
      }
    }
    return this;
  },
});
Elements.from = function (e, d) {
  if (d || d == null) {
    e = e.stripScripts();
  }
  var b,
    c = e.match(/^\s*<(t[dhr]|tbody|tfoot|thead)/i);
  if (c) {
    b = new Element("table");
    var a = c[1].toLowerCase();
    if (["td", "th", "tr"].contains(a)) {
      b = new Element("tbody").inject(b);
      if (a != "tr") {
        b = new Element("tr").inject(b);
      }
    }
  }
  return (b || new Element("div")).set("html", e).getChildren();
};
(function () {
  var d = { relay: false },
    c = ["once", "throttle", "pause"],
    b = c.length;
  while (b--) {
    d[c[b]] = Events.lookupPseudo(c[b]);
  }
  DOMEvent.definePseudo = function (e, f) {
    d[e] = f;
    return this;
  };
  var a = Element.prototype;
  [Element, Window, Document].invoke(
    "implement",
    Events.Pseudos(d, a.addEvent, a.removeEvent)
  );
})();
(function () {
  var a = "$moo:keys-pressed",
    b = "$moo:keys-keyup";
  DOMEvent.definePseudo("keys", function (d, e, c) {
    var g = c[0],
      f = [],
      h = this.retrieve(a, []);
    f.append(
      d.value
        .replace("++", function () {
          f.push("+");
          return "";
        })
        .split("+")
    );
    h.include(g.key);
    if (
      f.every(function (j) {
        return h.contains(j);
      })
    ) {
      e.apply(this, c);
    }
    this.store(a, h);
    if (!this.retrieve(b)) {
      var i = function (j) {
        (function () {
          h = this.retrieve(a, []).erase(j.key);
          this.store(a, h);
        }).delay(0, this);
      };
      this.store(b, i).addEvent("keyup", i);
    }
  });
  DOMEvent.defineKeys({
    16: "shift",
    17: "control",
    18: "alt",
    20: "capslock",
    33: "pageup",
    34: "pagedown",
    35: "end",
    36: "home",
    144: "numlock",
    145: "scrolllock",
    186: ";",
    187: "=",
    188: ",",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
    107: "+",
  }).defineKey(Browser.firefox ? 109 : 189, "-");
})();
(function () {
  var b = function (e, d) {
    var f = [];
    Object.each(d, function (g) {
      Object.each(g, function (h) {
        e.each(function (i) {
          f.push(i + "-" + h + (i == "border" ? "-width" : ""));
        });
      });
    });
    return f;
  };
  var c = function (f, e) {
    var d = 0;
    Object.each(e, function (h, g) {
      if (g.test(f)) {
        d = d + h.toInt();
      }
    });
    return d;
  };
  var a = function (d) {
    return !!(!d || d.offsetHeight || d.offsetWidth);
  };
  Element.implement({
    measure: function (h) {
      if (a(this)) {
        return h.call(this);
      }
      var g = this.getParent(),
        e = [];
      while (!a(g) && g != document.body) {
        e.push(g.expose());
        g = g.getParent();
      }
      var f = this.expose(),
        d = h.call(this);
      f();
      e.each(function (i) {
        i();
      });
      return d;
    },
    expose: function () {
      if (this.getStyle("display") != "none") {
        return function () {};
      }
      var d = this.style.cssText;
      this.setStyles({
        display: "block",
        position: "absolute",
        visibility: "hidden",
      });
      return function () {
        this.style.cssText = d;
      }.bind(this);
    },
    getDimensions: function (d) {
      d = Object.merge({ computeSize: false }, d);
      var i = { x: 0, y: 0 };
      var h = function (j, e) {
        return e.computeSize ? j.getComputedSize(e) : j.getSize();
      };
      var f = this.getParent("body");
      if (f && this.getStyle("display") == "none") {
        i = this.measure(function () {
          return h(this, d);
        });
      } else {
        if (f) {
          try {
            i = h(this, d);
          } catch (g) {}
        }
      }
      return Object.append(
        i,
        i.x || i.x === 0
          ? { width: i.x, height: i.y }
          : { x: i.width, y: i.height }
      );
    },
    getComputedSize: function (d) {
      d = Object.merge(
        {
          styles: ["padding", "border"],
          planes: { height: ["top", "bottom"], width: ["left", "right"] },
          mode: "both",
        },
        d
      );
      var g = {},
        e = { width: 0, height: 0 },
        f;
      if (d.mode == "vertical") {
        delete e.width;
        delete d.planes.width;
      } else {
        if (d.mode == "horizontal") {
          delete e.height;
          delete d.planes.height;
        }
      }
      b(d.styles, d.planes).each(function (h) {
        g[h] = this.getStyle(h).toInt();
      }, this);
      Object.each(
        d.planes,
        function (i, h) {
          var k = h.capitalize(),
            j = this.getStyle(h);
          if (j == "auto" && !f) {
            f = this.getDimensions();
          }
          j = g[h] = j == "auto" ? f[h] : j.toInt();
          e["total" + k] = j;
          i.each(function (m) {
            var l = c(m, g);
            e["computed" + m.capitalize()] = l;
            e["total" + k] += l;
          });
        },
        this
      );
      return Object.append(e, g);
    },
  });
})();
(function () {
  var a = false,
    b = false;
  var c = function () {
    var d = new Element("div")
      .setStyles({ position: "fixed", top: 0, right: 0 })
      .inject(document.body);
    a = d.offsetTop === 0;
    d.dispose();
    b = true;
  };
  Element.implement({
    pin: function (h, f) {
      if (!b) {
        c();
      }
      if (this.getStyle("display") == "none") {
        return this;
      }
      var j,
        k = window.getScroll(),
        l,
        e;
      if (h !== false) {
        j = this.getPosition(a ? document.body : this.getOffsetParent());
        if (!this.retrieve("pin:_pinned")) {
          var g = { top: j.y - k.y, left: j.x - k.x };
          if (a && !f) {
            this.setStyle("position", "fixed").setStyles(g);
          } else {
            l = this.getOffsetParent();
            var i = this.getPosition(l),
              m = this.getStyles("left", "top");
            if ((l && m.left == "auto") || m.top == "auto") {
              this.setPosition(i);
            }
            if (this.getStyle("position") == "static") {
              this.setStyle("position", "absolute");
            }
            i = { x: m.left.toInt() - k.x, y: m.top.toInt() - k.y };
            e = function () {
              if (!this.retrieve("pin:_pinned")) {
                return;
              }
              var n = window.getScroll();
              this.setStyles({ left: i.x + n.x, top: i.y + n.y });
            }.bind(this);
            this.store("pin:_scrollFixer", e);
            window.addEvent("scroll", e);
          }
          this.store("pin:_pinned", true);
        }
      } else {
        if (!this.retrieve("pin:_pinned")) {
          return this;
        }
        l = this.getParent();
        var d =
          l.getComputedStyle("position") != "static" ? l : l.getOffsetParent();
        j = this.getPosition(d);
        this.store("pin:_pinned", false);
        e = this.retrieve("pin:_scrollFixer");
        if (!e) {
          this.setStyles({
            position: "absolute",
            top: j.y + k.y,
            left: j.x + k.x,
          });
        } else {
          this.store("pin:_scrollFixer", null);
          window.removeEvent("scroll", e);
        }
        this.removeClass("isPinned");
      }
      return this;
    },
    unpin: function () {
      return this.pin(false);
    },
    togglePin: function () {
      return this.pin(!this.retrieve("pin:_pinned"));
    },
  });
})();
(function (b) {
  var a = (Element.Position = {
    options: {
      relativeTo: document.body,
      position: { x: "center", y: "center" },
      offset: { x: 0, y: 0 },
    },
    getOptions: function (d, c) {
      c = Object.merge({}, a.options, c);
      a.setPositionOption(c);
      a.setEdgeOption(c);
      a.setOffsetOption(d, c);
      a.setDimensionsOption(d, c);
      return c;
    },
    setPositionOption: function (c) {
      c.position = a.getCoordinateFromValue(c.position);
    },
    setEdgeOption: function (d) {
      var c = a.getCoordinateFromValue(d.edge);
      d.edge = c
        ? c
        : d.position.x == "center" && d.position.y == "center"
        ? { x: "center", y: "center" }
        : { x: "left", y: "top" };
    },
    setOffsetOption: function (f, d) {
      var c = { x: 0, y: 0 },
        g = f.measure(function () {
          return document.id(this.getOffsetParent());
        }),
        e = g.getScroll();
      if (!g || g == f.getDocument().body) {
        return;
      }
      c = g.measure(function () {
        var i = this.getPosition();
        if (this.getStyle("position") == "fixed") {
          var h = window.getScroll();
          i.x += h.x;
          i.y += h.y;
        }
        return i;
      });
      d.offset = {
        parentPositioned: g != document.id(d.relativeTo),
        x: d.offset.x - c.x + e.x,
        y: d.offset.y - c.y + e.y,
      };
    },
    setDimensionsOption: function (d, c) {
      c.dimensions = d.getDimensions({
        computeSize: true,
        styles: ["padding", "border", "margin"],
      });
    },
    getPosition: function (e, d) {
      var c = {};
      d = a.getOptions(e, d);
      var f = document.id(d.relativeTo) || document.body;
      a.setPositionCoordinates(d, c, f);
      if (d.edge) {
        a.toEdge(c, d);
      }
      var g = d.offset;
      c.left = (
        c.x >= 0 || g.parentPositioned || d.allowNegative ? c.x : 0
      ).toInt();
      c.top = (
        c.y >= 0 || g.parentPositioned || d.allowNegative ? c.y : 0
      ).toInt();
      a.toMinMax(c, d);
      if (d.relFixedPosition || f.getStyle("position") == "fixed") {
        a.toRelFixedPosition(f, c);
      }
      if (d.ignoreScroll) {
        a.toIgnoreScroll(f, c);
      }
      if (d.ignoreMargins) {
        a.toIgnoreMargins(c, d);
      }
      c.left = Math.ceil(c.left);
      c.top = Math.ceil(c.top);
      delete c.x;
      delete c.y;
      return c;
    },
    setPositionCoordinates: function (k, g, d) {
      var f = k.offset.y,
        h = k.offset.x,
        e = d == document.body ? window.getScroll() : d.getPosition(),
        j = e.y,
        c = e.x,
        i = window.getSize();
      switch (k.position.x) {
        case "left":
          g.x = c + h;
          break;
        case "right":
          g.x = c + h + d.offsetWidth;
          break;
        default:
          g.x = c + (d == document.body ? i.x : d.offsetWidth) / 2 + h;
          break;
      }
      switch (k.position.y) {
        case "top":
          g.y = j + f;
          break;
        case "bottom":
          g.y = j + f + d.offsetHeight;
          break;
        default:
          g.y = j + (d == document.body ? i.y : d.offsetHeight) / 2 + f;
          break;
      }
    },
    toMinMax: function (c, d) {
      var f = { left: "x", top: "y" },
        e;
      ["minimum", "maximum"].each(function (g) {
        ["left", "top"].each(function (h) {
          e = d[g] ? d[g][f[h]] : null;
          if (e != null && (g == "minimum" ? c[h] < e : c[h] > e)) {
            c[h] = e;
          }
        });
      });
    },
    toRelFixedPosition: function (e, c) {
      var d = window.getScroll();
      c.top += d.y;
      c.left += d.x;
    },
    toIgnoreScroll: function (e, d) {
      var c = e.getScroll();
      d.top -= c.y;
      d.left -= c.x;
    },
    toIgnoreMargins: function (c, d) {
      c.left +=
        d.edge.x == "right"
          ? d.dimensions["margin-right"]
          : d.edge.x != "center"
          ? -d.dimensions["margin-left"]
          : -d.dimensions["margin-left"] +
            (d.dimensions["margin-right"] + d.dimensions["margin-left"]) / 2;
      c.top +=
        d.edge.y == "bottom"
          ? d.dimensions["margin-bottom"]
          : d.edge.y != "center"
          ? -d.dimensions["margin-top"]
          : -d.dimensions["margin-top"] +
            (d.dimensions["margin-bottom"] + d.dimensions["margin-top"]) / 2;
    },
    toEdge: function (c, d) {
      var e = {},
        g = d.dimensions,
        f = d.edge;
      switch (f.x) {
        case "left":
          e.x = 0;
          break;
        case "right":
          e.x = -g.x - g.computedRight - g.computedLeft;
          break;
        default:
          e.x = -Math.round(g.totalWidth / 2);
          break;
      }
      switch (f.y) {
        case "top":
          e.y = 0;
          break;
        case "bottom":
          e.y = -g.y - g.computedTop - g.computedBottom;
          break;
        default:
          e.y = -Math.round(g.totalHeight / 2);
          break;
      }
      c.x += e.x;
      c.y += e.y;
    },
    getCoordinateFromValue: function (c) {
      if (typeOf(c) != "string") {
        return c;
      }
      c = c.toLowerCase();
      return {
        x: c.test("left") ? "left" : c.test("right") ? "right" : "center",
        y: c.test(/upper|top/) ? "top" : c.test("bottom") ? "bottom" : "center",
      };
    },
  });
  Element.implement({
    position: function (d) {
      if (d && (d.x != null || d.y != null)) {
        return b ? b.apply(this, arguments) : this;
      }
      var c = this.setStyle("position", "absolute").calculatePosition(d);
      return d && d.returnPos ? c : this.setStyles(c);
    },
    calculatePosition: function (c) {
      return a.getPosition(this, c);
    },
  });
})(Element.prototype.position);
Element.implement({
  isDisplayed: function () {
    return this.getStyle("display") != "none";
  },
  isVisible: function () {
    var a = this.offsetWidth,
      b = this.offsetHeight;
    return a == 0 && b == 0
      ? false
      : a > 0 && b > 0
      ? true
      : this.style.display != "none";
  },
  toggle: function () {
    return this[this.isDisplayed() ? "hide" : "show"]();
  },
  hide: function () {
    var b;
    try {
      b = this.getStyle("display");
    } catch (a) {}
    if (b == "none") {
      return this;
    }
    return this.store("element:_originalDisplay", b || "").setStyle(
      "display",
      "none"
    );
  },
  show: function (a) {
    if (!a && this.isDisplayed()) {
      return this;
    }
    a = a || this.retrieve("element:_originalDisplay") || "block";
    return this.setStyle("display", a == "none" ? "block" : a);
  },
  swapClass: function (a, b) {
    return this.removeClass(a).addClass(b);
  },
});
Document.implement({
  clearSelection: function () {
    if (window.getSelection) {
      var a = window.getSelection();
      if (a && a.removeAllRanges) {
        a.removeAllRanges();
      }
    } else {
      if (document.selection && document.selection.empty) {
        try {
          document.selection.empty();
        } catch (b) {}
      }
    }
  },
});
var IframeShim = new Class({
  Implements: [Options, Events, Class.Occlude],
  options: {
    className: "iframeShim",
    src: 'javascript:false;document.write("");',
    display: false,
    zIndex: null,
    margin: 0,
    offset: { x: 0, y: 0 },
    browsers:
      Browser.ie6 ||
      (Browser.firefox && Browser.version < 3 && Browser.Platform.mac),
  },
  property: "IframeShim",
  initialize: function (b, a) {
    this.element = document.id(b);
    if (this.occlude()) {
      return this.occluded;
    }
    this.setOptions(a);
    this.makeShim();
    return this;
  },
  makeShim: function () {
    if (this.options.browsers) {
      var c = this.element.getStyle("zIndex").toInt();
      if (!c) {
        c = 1;
        var b = this.element.getStyle("position");
        if (b == "static" || !b) {
          this.element.setStyle("position", "relative");
        }
        this.element.setStyle("zIndex", c);
      }
      c =
        (this.options.zIndex != null || this.options.zIndex === 0) &&
        c > this.options.zIndex
          ? this.options.zIndex
          : c - 1;
      if (c < 0) {
        c = 1;
      }
      this.shim = new Element("iframe", {
        src: this.options.src,
        scrolling: "no",
        frameborder: 0,
        styles: {
          zIndex: c,
          position: "absolute",
          border: "none",
          filter: "progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)",
        },
        class: this.options.className,
      }).store("IframeShim", this);
      var a = function () {
        this.shim.inject(this.element, "after");
        this[this.options.display ? "show" : "hide"]();
        this.fireEvent("inject");
      }.bind(this);
      if (!IframeShim.ready) {
        window.addEvent("load", a);
      } else {
        a();
      }
    } else {
      this.position =
        this.hide =
        this.show =
        this.dispose =
          Function.from(this);
    }
  },
  position: function () {
    if (!IframeShim.ready || !this.shim) {
      return this;
    }
    var a = this.element.measure(function () {
      return this.getSize();
    });
    if (this.options.margin != undefined) {
      a.x = a.x - this.options.margin * 2;
      a.y = a.y - this.options.margin * 2;
      this.options.offset.x += this.options.margin;
      this.options.offset.y += this.options.margin;
    }
    this.shim
      .set({ width: a.x, height: a.y })
      .position({ relativeTo: this.element, offset: this.options.offset });
    return this;
  },
  hide: function () {
    if (this.shim) {
      this.shim.setStyle("display", "none");
    }
    return this;
  },
  show: function () {
    if (this.shim) {
      this.shim.setStyle("display", "block");
    }
    return this.position();
  },
  dispose: function () {
    if (this.shim) {
      this.shim.dispose();
    }
    return this;
  },
  destroy: function () {
    if (this.shim) {
      this.shim.destroy();
    }
    return this;
  },
});
window.addEvent("load", function () {
  IframeShim.ready = true;
});
var Mask = new Class({
  Implements: [Options, Events],
  Binds: ["position"],
  options: {
    style: {},
    class: "mask",
    maskMargins: false,
    useIframeShim: true,
    iframeShimOptions: {},
  },
  initialize: function (b, a) {
    this.target = document.id(b) || document.id(document.body);
    this.target.store("mask", this);
    this.setOptions(a);
    this.render();
    this.inject();
  },
  render: function () {
    this.element = new Element("div", {
      class: this.options["class"],
      id: this.options.id || "mask-" + String.uniqueID(),
      styles: Object.merge({}, this.options.style, { display: "none" }),
      events: {
        click: function (a) {
          this.fireEvent("click", a);
          if (this.options.hideOnClick) {
            this.hide();
          }
        }.bind(this),
      },
    });
    this.hidden = true;
  },
  toElement: function () {
    return this.element;
  },
  inject: function (b, a) {
    a =
      a ||
      (this.options.inject ? this.options.inject.where : "") ||
      this.target == document.body
        ? "inside"
        : "after";
    b = b || (this.options.inject && this.options.inject.target) || this.target;
    this.element.inject(b, a);
    if (this.options.useIframeShim) {
      this.shim = new IframeShim(this.element, this.options.iframeShimOptions);
      this.addEvents({
        show: this.shim.show.bind(this.shim),
        hide: this.shim.hide.bind(this.shim),
        destroy: this.shim.destroy.bind(this.shim),
      });
    }
  },
  position: function () {
    this.resize(this.options.width, this.options.height);
    this.element.position({
      relativeTo: this.target,
      position: "topLeft",
      ignoreMargins: !this.options.maskMargins,
      ignoreScroll: this.target == document.body,
    });
    return this;
  },
  resize: function (a, e) {
    var b = { styles: ["padding", "border"] };
    if (this.options.maskMargins) {
      b.styles.push("margin");
    }
    var d = this.target.getComputedSize(b);
    if (this.target == document.body) {
      this.element.setStyles({ width: 0, height: 0 });
      var c = window.getScrollSize();
      if (d.totalHeight < c.y) {
        d.totalHeight = c.y;
      }
      if (d.totalWidth < c.x) {
        d.totalWidth = c.x;
      }
    }
    this.element.setStyles({
      width: Array.pick([a, d.totalWidth, d.x]),
      height: Array.pick([e, d.totalHeight, d.y]),
    });
    return this;
  },
  show: function () {
    if (!this.hidden) {
      return this;
    }
    window.addEvent("resize", this.position);
    this.position();
    this.showMask.apply(this, arguments);
    return this;
  },
  showMask: function () {
    this.element.setStyle("display", "block");
    this.hidden = false;
    this.fireEvent("show");
  },
  hide: function () {
    if (this.hidden) {
      return this;
    }
    window.removeEvent("resize", this.position);
    this.hideMask.apply(this, arguments);
    if (this.options.destroyOnHide) {
      return this.destroy();
    }
    return this;
  },
  hideMask: function () {
    this.element.setStyle("display", "none");
    this.hidden = true;
    this.fireEvent("hide");
  },
  toggle: function () {
    this[this.hidden ? "show" : "hide"]();
  },
  destroy: function () {
    this.hide();
    this.element.destroy();
    this.fireEvent("destroy");
    this.target.eliminate("mask");
  },
});
Element.Properties.mask = {
  set: function (b) {
    var a = this.retrieve("mask");
    if (a) {
      a.destroy();
    }
    return this.eliminate("mask").store("mask:options", b);
  },
  get: function () {
    var a = this.retrieve("mask");
    if (!a) {
      a = new Mask(this, this.retrieve("mask:options"));
      this.store("mask", a);
    }
    return a;
  },
};
Element.implement({
  mask: function (a) {
    if (a) {
      this.set("mask", a);
    }
    this.get("mask").show();
    return this;
  },
  unmask: function () {
    this.get("mask").hide();
    return this;
  },
});
var Spinner = new Class({
  Extends: Mask,
  Implements: Chain,
  options: {
    class: "spinner",
    containerPosition: {},
    content: { class: "spinner-content" },
    messageContainer: { class: "spinner-msg" },
    img: { class: "spinner-img" },
    fxOptions: { link: "chain" },
  },
  initialize: function (c, a) {
    this.target = document.id(c) || document.id(document.body);
    this.target.store("spinner", this);
    this.setOptions(a);
    this.render();
    this.inject();
    var b = function () {
      this.active = false;
    }.bind(this);
    this.addEvents({ hide: b, show: b });
  },
  render: function () {
    this.parent();
    this.element.set("id", this.options.id || "spinner-" + String.uniqueID());
    this.content =
      document.id(this.options.content) ||
      new Element("div", this.options.content);
    this.content.inject(this.element);
    if (this.options.message) {
      this.msg =
        document.id(this.options.message) ||
        new Element("p", this.options.messageContainer).appendText(
          this.options.message
        );
      this.msg.inject(this.content);
    }
    if (this.options.img) {
      this.img =
        document.id(this.options.img) || new Element("div", this.options.img);
      this.img.inject(this.content);
    }
    this.element.set("tween", this.options.fxOptions);
  },
  show: function (a) {
    if (this.active) {
      return this.chain(this.show.bind(this));
    }
    if (!this.hidden) {
      this.callChain.delay(20, this);
      return this;
    }
    this.active = true;
    return this.parent(a);
  },
  showMask: function (a) {
    var b = function () {
      this.content.position(
        Object.merge(
          { relativeTo: this.element },
          this.options.containerPosition
        )
      );
    }.bind(this);
    if (a) {
      this.parent();
      b();
    } else {
      if (!this.options.style.opacity) {
        this.options.style.opacity = this.element.getStyle("opacity").toFloat();
      }
      this.element
        .setStyles({ display: "block", opacity: 0 })
        .tween("opacity", this.options.style.opacity);
      b();
      this.hidden = false;
      this.fireEvent("show");
      this.callChain();
    }
  },
  hide: function (a) {
    if (this.active) {
      return this.chain(this.hide.bind(this));
    }
    if (this.hidden) {
      this.callChain.delay(20, this);
      return this;
    }
    this.active = true;
    return this.parent(a);
  },
  hideMask: function (a) {
    if (a) {
      return this.parent();
    }
    this.element
      .tween("opacity", 0)
      .get("tween")
      .chain(
        function () {
          this.element.setStyle("display", "none");
          this.hidden = true;
          this.fireEvent("hide");
          this.callChain();
        }.bind(this)
      );
  },
  destroy: function () {
    this.content.destroy();
    this.parent();
    this.target.eliminate("spinner");
  },
});
Request = Class.refactor(Request, {
  options: { useSpinner: false, spinnerOptions: {}, spinnerTarget: false },
  initialize: function (a) {
    this._send = this.send;
    this.send = function (b) {
      var c = this.getSpinner();
      if (c) {
        c.chain(this._send.pass(b, this)).show();
      } else {
        this._send(b);
      }
      return this;
    };
    this.previous(a);
  },
  getSpinner: function () {
    if (!this.spinner) {
      var b =
        document.id(this.options.spinnerTarget) ||
        document.id(this.options.update);
      if (this.options.useSpinner && b) {
        b.set("spinner", this.options.spinnerOptions);
        var a = (this.spinner = b.get("spinner"));
        ["complete", "exception", "cancel"].each(function (c) {
          this.addEvent(c, a.hide.bind(a));
        }, this);
      }
    }
    return this.spinner;
  },
});
Element.Properties.spinner = {
  set: function (a) {
    var b = this.retrieve("spinner");
    if (b) {
      b.destroy();
    }
    return this.eliminate("spinner").store("spinner:options", a);
  },
  get: function () {
    var a = this.retrieve("spinner");
    if (!a) {
      a = new Spinner(this, this.retrieve("spinner:options"));
      this.store("spinner", a);
    }
    return a;
  },
};
Element.implement({
  spin: function (a) {
    if (a) {
      this.set("spinner", a);
    }
    this.get("spinner").show();
    return this;
  },
  unspin: function () {
    this.get("spinner").hide();
    return this;
  },
});
if (!window.Form) {
  window.Form = {};
}
(function () {
  Form.Request = new Class({
    Binds: ["onSubmit", "onFormValidate"],
    Implements: [Options, Events, Class.Occlude],
    options: {
      requestOptions: {
        evalScripts: true,
        useSpinner: true,
        emulation: false,
        link: "ignore",
      },
      sendButtonClicked: true,
      extraData: {},
      resetForm: true,
    },
    property: "form.request",
    initialize: function (b, c, a) {
      this.element = document.id(b);
      if (this.occlude()) {
        return this.occluded;
      }
      this.setOptions(a).setTarget(c).attach();
    },
    setTarget: function (a) {
      this.target = document.id(a);
      if (!this.request) {
        this.makeRequest();
      } else {
        this.request.setOptions({ update: this.target });
      }
      return this;
    },
    toElement: function () {
      return this.element;
    },
    makeRequest: function () {
      var a = this;
      this.request = new Request.HTML(
        Object.merge(
          {
            update: this.target,
            emulation: false,
            spinnerTarget: this.element,
            method: this.element.get("method") || "post",
          },
          this.options.requestOptions
        )
      ).addEvents({
        success: function (c, e, d, b) {
          ["complete", "success"].each(function (f) {
            a.fireEvent(f, [a.target, c, e, d, b]);
          });
        },
        failure: function () {
          a.fireEvent("complete", arguments).fireEvent("failure", arguments);
        },
        exception: function () {
          a.fireEvent("failure", arguments);
        },
      });
      return this.attachReset();
    },
    attachReset: function () {
      if (!this.options.resetForm) {
        return this;
      }
      this.request.addEvent(
        "success",
        function () {
          Function.attempt(
            function () {
              this.element.reset();
            }.bind(this)
          );
          if (window.OverText) {
            OverText.update();
          }
        }.bind(this)
      );
      return this;
    },
    attach: function (a) {
      var c = a != false ? "addEvent" : "removeEvent";
      this.element[c](
        "click:relay(button, input[type=submit])",
        this.saveClickedButton.bind(this)
      );
      var b = this.element.retrieve("validator");
      if (b) {
        b[c]("onFormValidate", this.onFormValidate);
      } else {
        this.element[c]("submit", this.onSubmit);
      }
      return this;
    },
    detach: function () {
      return this.attach(false);
    },
    enable: function () {
      return this.attach();
    },
    disable: function () {
      return this.detach();
    },
    onFormValidate: function (c, b, a) {
      if (!a) {
        return;
      }
      var d = this.element.retrieve("validator");
      if (c || (d && !d.options.stopOnFailure)) {
        a.stop();
        this.send();
      }
    },
    onSubmit: function (a) {
      var b = this.element.retrieve("validator");
      if (b) {
        this.element.removeEvent("submit", this.onSubmit);
        b.addEvent("onFormValidate", this.onFormValidate);
        this.element.validate();
        return;
      }
      if (a) {
        a.stop();
      }
      this.send();
    },
    saveClickedButton: function (b, c) {
      var a = c.get("name");
      if (!a || !this.options.sendButtonClicked) {
        return;
      }
      this.options.extraData[a] = c.get("value") || true;
      this.clickedCleaner = function () {
        delete this.options.extraData[a];
        this.clickedCleaner = function () {};
      }.bind(this);
    },
    clickedCleaner: function () {},
    send: function () {
      var b = this.element.toQueryString().trim(),
        a = Object.toQueryString(this.options.extraData);
      if (b) {
        b += "&" + a;
      } else {
        b = a;
      }
      this.fireEvent("send", [this.element, b.parseQueryString()]);
      this.request.send({
        data: b,
        url: this.options.requestOptions.url || this.element.get("action"),
      });
      this.clickedCleaner();
      return this;
    },
  });
  Element.implement("formUpdate", function (c, b) {
    var a = this.retrieve("form.request");
    if (!a) {
      a = new Form.Request(this, c, b);
    } else {
      if (c) {
        a.setTarget(c);
      }
      if (b) {
        a.setOptions(b).makeRequest();
      }
    }
    a.send();
    return this;
  });
})();
(function () {
  var a = function (d) {
    var b = d.options.hideInputs;
    if (window.OverText) {
      var c = [null];
      OverText.each(function (e) {
        c.include("." + e.options.labelClass);
      });
      if (c) {
        b += c.join(", ");
      }
    }
    return b ? d.element.getElements(b) : null;
  };
  Fx.Reveal = new Class({
    Extends: Fx.Morph,
    options: {
      link: "cancel",
      styles: ["padding", "border", "margin"],
      transitionOpacity: !Browser.ie6,
      mode: "vertical",
      display: function () {
        return this.element.get("tag") != "tr" ? "block" : "table-row";
      },
      opacity: 1,
      hideInputs: Browser.ie ? "select, input, textarea, object, embed" : null,
    },
    dissolve: function () {
      if (!this.hiding && !this.showing) {
        if (this.element.getStyle("display") != "none") {
          this.hiding = true;
          this.showing = false;
          this.hidden = true;
          this.cssText = this.element.style.cssText;
          var d = this.element.getComputedSize({
            styles: this.options.styles,
            mode: this.options.mode,
          });
          if (this.options.transitionOpacity) {
            d.opacity = this.options.opacity;
          }
          var c = {};
          Object.each(d, function (f, e) {
            c[e] = [f, 0];
          });
          this.element.setStyles({
            display: Function.from(this.options.display).call(this),
            overflow: "hidden",
          });
          var b = a(this);
          if (b) {
            b.setStyle("visibility", "hidden");
          }
          this.$chain.unshift(
            function () {
              if (this.hidden) {
                this.hiding = false;
                this.element.style.cssText = this.cssText;
                this.element.setStyle("display", "none");
                if (b) {
                  b.setStyle("visibility", "visible");
                }
              }
              this.fireEvent("hide", this.element);
              this.callChain();
            }.bind(this)
          );
          this.start(c);
        } else {
          this.callChain.delay(10, this);
          this.fireEvent("complete", this.element);
          this.fireEvent("hide", this.element);
        }
      } else {
        if (this.options.link == "chain") {
          this.chain(this.dissolve.bind(this));
        } else {
          if (this.options.link == "cancel" && !this.hiding) {
            this.cancel();
            this.dissolve();
          }
        }
      }
      return this;
    },
    reveal: function () {
      if (!this.showing && !this.hiding) {
        if (this.element.getStyle("display") == "none") {
          this.hiding = false;
          this.showing = true;
          this.hidden = false;
          this.cssText = this.element.style.cssText;
          var d;
          this.element.measure(
            function () {
              d = this.element.getComputedSize({
                styles: this.options.styles,
                mode: this.options.mode,
              });
            }.bind(this)
          );
          if (this.options.heightOverride != null) {
            d.height = this.options.heightOverride.toInt();
          }
          if (this.options.widthOverride != null) {
            d.width = this.options.widthOverride.toInt();
          }
          if (this.options.transitionOpacity) {
            this.element.setStyle("opacity", 0);
            d.opacity = this.options.opacity;
          }
          var c = {
            height: 0,
            display: Function.from(this.options.display).call(this),
          };
          Object.each(d, function (f, e) {
            c[e] = 0;
          });
          c.overflow = "hidden";
          this.element.setStyles(c);
          var b = a(this);
          if (b) {
            b.setStyle("visibility", "hidden");
          }
          this.$chain.unshift(
            function () {
              this.element.style.cssText = this.cssText;
              this.element.setStyle(
                "display",
                Function.from(this.options.display).call(this)
              );
              if (!this.hidden) {
                this.showing = false;
              }
              if (b) {
                b.setStyle("visibility", "visible");
              }
              this.callChain();
              this.fireEvent("show", this.element);
            }.bind(this)
          );
          this.start(d);
        } else {
          this.callChain();
          this.fireEvent("complete", this.element);
          this.fireEvent("show", this.element);
        }
      } else {
        if (this.options.link == "chain") {
          this.chain(this.reveal.bind(this));
        } else {
          if (this.options.link == "cancel" && !this.showing) {
            this.cancel();
            this.reveal();
          }
        }
      }
      return this;
    },
    toggle: function () {
      if (this.element.getStyle("display") == "none") {
        this.reveal();
      } else {
        this.dissolve();
      }
      return this;
    },
    cancel: function () {
      this.parent.apply(this, arguments);
      if (this.cssText != null) {
        this.element.style.cssText = this.cssText;
      }
      this.hiding = false;
      this.showing = false;
      return this;
    },
  });
  Element.Properties.reveal = {
    set: function (b) {
      this.get("reveal").cancel().setOptions(b);
      return this;
    },
    get: function () {
      var b = this.retrieve("reveal");
      if (!b) {
        b = new Fx.Reveal(this);
        this.store("reveal", b);
      }
      return b;
    },
  };
  Element.Properties.dissolve = Element.Properties.reveal;
  Element.implement({
    reveal: function (b) {
      this.get("reveal").setOptions(b).reveal();
      return this;
    },
    dissolve: function (b) {
      this.get("reveal").setOptions(b).dissolve();
      return this;
    },
    nix: function (b) {
      var c = Array.link(arguments, {
        destroy: Type.isBoolean,
        options: Type.isObject,
      });
      this.get("reveal")
        .setOptions(b)
        .dissolve()
        .chain(
          function () {
            this[c.destroy ? "destroy" : "dispose"]();
          }.bind(this)
        );
      return this;
    },
    wink: function () {
      var c = Array.link(arguments, {
        duration: Type.isNumber,
        options: Type.isObject,
      });
      var b = this.get("reveal").setOptions(c.options);
      b.reveal().chain(function () {
        (function () {
          b.dissolve();
        }).delay(c.duration || 2000);
      });
    },
  });
})();
Form.Request.Append = new Class({
  Extends: Form.Request,
  options: { useReveal: true, revealOptions: {}, inject: "bottom" },
  makeRequest: function () {
    this.request = new Request.HTML(
      Object.merge(
        {
          url: this.element.get("action"),
          method: this.element.get("method") || "post",
          spinnerTarget: this.element,
        },
        this.options.requestOptions,
        { evalScripts: false }
      )
    ).addEvents({
      success: function (b, g, f, a) {
        var c;
        var d = Elements.from(f);
        if (d.length == 1) {
          c = d[0];
        } else {
          c = new Element("div", { styles: { display: "none" } }).adopt(d);
        }
        c.inject(this.target, this.options.inject);
        if (this.options.requestOptions.evalScripts) {
          Browser.exec(a);
        }
        this.fireEvent("beforeEffect", c);
        var e = function () {
          this.fireEvent("success", [c, this.target, b, g, f, a]);
        }.bind(this);
        if (this.options.useReveal) {
          c.set("reveal", this.options.revealOptions).get("reveal").chain(e);
          c.reveal();
        } else {
          e();
        }
      }.bind(this),
      failure: function (a) {
        this.fireEvent("failure", a);
      }.bind(this),
    });
    this.attachReset();
  },
});
Locale.define("en-US", "FormValidator", {
  required: "This field is required.",
  length:
    "Please enter {length} characters (you entered {elLength} characters)",
  minLength:
    "Please enter at least {minLength} characters (you entered {length} characters).",
  maxLength:
    "Please enter no more than {maxLength} characters (you entered {length} characters).",
  integer:
    "Please enter an integer in this field. Numbers with decimals (e.g. 1.25) are not permitted.",
  numeric:
    'Please enter only numeric values in this field (i.e. "1" or "1.1" or "-1" or "-1.1").',
  digits:
    "Please use numbers and punctuation only in this field (for example, a phone number with dashes or dots is permitted).",
  alpha:
    "Please use only letters (a-z) within this field. No spaces or other characters are allowed.",
  alphanum:
    "Please use only letters (a-z) or numbers (0-9) in this field. No spaces or other characters are allowed.",
  dateSuchAs: "Please enter a valid date such as {date}",
  dateInFormatMDY:
    'Please enter a valid date such as MM/DD/YYYY (i.e. "12/31/1999")',
  email: 'Please enter a valid email address. For example "fred@domain.com".',
  url: "Please enter a valid URL such as http://www.example.com.",
  currencyDollar: "Please enter a valid $ amount. For example $100.00 .",
  oneRequired: "Please enter something for at least one of these inputs.",
  errorPrefix: "Error: ",
  warningPrefix: "Warning: ",
  noSpace: "There can be no spaces in this input.",
  reqChkByNode: "No items are selected.",
  requiredChk: "This field is required.",
  reqChkByName: "Please select a {label}.",
  match: "This field needs to match the {matchName} field",
  startDate: "the start date",
  endDate: "the end date",
  currendDate: "the current date",
  afterDate: "The date should be the same or after {label}.",
  beforeDate: "The date should be the same or before {label}.",
  startMonth: "Please select a start month",
  sameMonth:
    "These two dates must be in the same month - you must change one or the other.",
  creditcard:
    "The credit card number entered is invalid. Please check the number and try again. {length} digits entered.",
});
if (!window.Form) {
  window.Form = {};
}
var InputValidator = (this.InputValidator = new Class({
  Implements: [Options],
  options: { errorMsg: "Validation failed.", test: Function.from(true) },
  initialize: function (b, a) {
    this.setOptions(a);
    this.className = b;
  },
  test: function (b, a) {
    b = document.id(b);
    return b ? this.options.test(b, a || this.getProps(b)) : false;
  },
  getError: function (c, a) {
    c = document.id(c);
    var b = this.options.errorMsg;
    if (typeOf(b) == "function") {
      b = b(c, a || this.getProps(c));
    }
    return b;
  },
  getProps: function (a) {
    a = document.id(a);
    return a ? a.get("validatorProps") : {};
  },
}));
Element.Properties.validators = {
  get: function () {
    return (this.get("data-validators") || this.className).clean().split(" ");
  },
};
Element.Properties.validatorProps = {
  set: function (a) {
    return this.eliminate("$moo:validatorProps").store(
      "$moo:validatorProps",
      a
    );
  },
  get: function (a) {
    if (a) {
      this.set(a);
    }
    if (this.retrieve("$moo:validatorProps")) {
      return this.retrieve("$moo:validatorProps");
    }
    if (
      this.getProperty("data-validator-properties") ||
      this.getProperty("validatorProps")
    ) {
      try {
        this.store(
          "$moo:validatorProps",
          JSON.decode(
            this.getProperty("validatorProps") ||
              this.getProperty("data-validator-properties")
          )
        );
      } catch (c) {
        return {};
      }
    } else {
      var b = this.get("validators").filter(function (d) {
        return d.test(":");
      });
      if (!b.length) {
        this.store("$moo:validatorProps", {});
      } else {
        a = {};
        b.each(function (d) {
          var f = d.split(":");
          if (f[1]) {
            try {
              a[f[0]] = JSON.decode(f[1]);
            } catch (g) {}
          }
        });
        this.store("$moo:validatorProps", a);
      }
    }
    return this.retrieve("$moo:validatorProps");
  },
};
Form.Validator = new Class({
  Implements: [Options, Events],
  Binds: ["onSubmit"],
  options: {
    fieldSelectors: "input, select, textarea",
    ignoreHidden: true,
    ignoreDisabled: true,
    useTitles: false,
    evaluateOnSubmit: true,
    evaluateFieldsOnBlur: true,
    evaluateFieldsOnChange: true,
    serial: true,
    stopOnFailure: true,
    warningPrefix: function () {
      return Form.Validator.getMsg("warningPrefix") || "Warning: ";
    },
    errorPrefix: function () {
      return Form.Validator.getMsg("errorPrefix") || "Error: ";
    },
  },
  initialize: function (b, a) {
    this.setOptions(a);
    this.element = document.id(b);
    this.element.store("validator", this);
    this.warningPrefix = Function.from(this.options.warningPrefix)();
    this.errorPrefix = Function.from(this.options.errorPrefix)();
    if (this.options.evaluateOnSubmit) {
      this.element.addEvent("submit", this.onSubmit);
    }
    if (
      this.options.evaluateFieldsOnBlur ||
      this.options.evaluateFieldsOnChange
    ) {
      this.watchFields(this.getFields());
    }
  },
  toElement: function () {
    return this.element;
  },
  getFields: function () {
    return (this.fields = this.element.getElements(
      this.options.fieldSelectors
    ));
  },
  watchFields: function (a) {
    a.each(function (b) {
      if (this.options.evaluateFieldsOnBlur) {
        b.addEvent("blur", this.validationMonitor.pass([b, false], this));
      }
      if (this.options.evaluateFieldsOnChange) {
        b.addEvent("change", this.validationMonitor.pass([b, true], this));
      }
    }, this);
  },
  validationMonitor: function () {
    clearTimeout(this.timer);
    this.timer = this.validateField.delay(50, this, arguments);
  },
  onSubmit: function (a) {
    if (this.validate(a)) {
      this.reset();
    }
  },
  reset: function () {
    this.getFields().each(this.resetField, this);
    return this;
  },
  validate: function (b) {
    var a = this.getFields()
      .map(function (c) {
        return this.validateField(c, true);
      }, this)
      .every(function (c) {
        return c;
      });
    this.fireEvent("formValidate", [a, this.element, b]);
    if (this.options.stopOnFailure && !a && b) {
      b.preventDefault();
    }
    return a;
  },
  validateField: function (j, b) {
    if (this.paused) {
      return true;
    }
    j = document.id(j);
    var f = !j.hasClass("validation-failed");
    var g, i;
    if (this.options.serial && !b) {
      g = this.element.getElement(".validation-failed");
      i = this.element.getElement(".warning");
    }
    if (
      j &&
      (!g ||
        b ||
        j.hasClass("validation-failed") ||
        (g && !this.options.serial))
    ) {
      var a = j.get("validators");
      var d = a.some(function (k) {
        return this.getValidator(k);
      }, this);
      var h = [];
      a.each(function (k) {
        if (k && !this.test(k, j)) {
          h.include(k);
        }
      }, this);
      f = h.length === 0;
      if (d && !this.hasValidator(j, "warnOnly")) {
        if (f) {
          j.addClass("validation-passed").removeClass("validation-failed");
          this.fireEvent("elementPass", [j]);
        } else {
          j.addClass("validation-failed").removeClass("validation-passed");
          this.fireEvent("elementFail", [j, h]);
        }
      }
      if (!i) {
        var e = a.some(function (k) {
          if (k.test("^warn")) {
            return this.getValidator(k.replace(/^warn-/, ""));
          } else {
            return null;
          }
        }, this);
        j.removeClass("warning");
        var c = a.map(function (k) {
          if (k.test("^warn")) {
            return this.test(k.replace(/^warn-/, ""), j, true);
          } else {
            return null;
          }
        }, this);
      }
    }
    return f;
  },
  test: function (b, d, e) {
    d = document.id(d);
    if (
      (this.options.ignoreHidden && !d.isVisible()) ||
      (this.options.ignoreDisabled && d.get("disabled"))
    ) {
      return true;
    }
    var a = this.getValidator(b);
    if (e != null) {
      e = false;
    }
    if (this.hasValidator(d, "warnOnly")) {
      e = true;
    }
    var c = this.hasValidator(d, "ignoreValidation") || (a ? a.test(d) : true);
    if (a && d.isVisible()) {
      this.fireEvent("elementValidate", [c, d, b, e]);
    }
    if (e) {
      return true;
    }
    return c;
  },
  hasValidator: function (b, a) {
    return b.get("validators").contains(a);
  },
  resetField: function (a) {
    a = document.id(a);
    if (a) {
      a.get("validators").each(function (b) {
        if (b.test("^warn-")) {
          b = b.replace(/^warn-/, "");
        }
        a.removeClass("validation-failed");
        a.removeClass("warning");
        a.removeClass("validation-passed");
      }, this);
    }
    return this;
  },
  stop: function () {
    this.paused = true;
    return this;
  },
  start: function () {
    this.paused = false;
    return this;
  },
  ignoreField: function (a, b) {
    a = document.id(a);
    if (a) {
      this.enforceField(a);
      if (b) {
        a.addClass("warnOnly");
      } else {
        a.addClass("ignoreValidation");
      }
    }
    return this;
  },
  enforceField: function (a) {
    a = document.id(a);
    if (a) {
      a.removeClass("warnOnly").removeClass("ignoreValidation");
    }
    return this;
  },
});
Form.Validator.getMsg = function (a) {
  return Locale.get("FormValidator." + a);
};
Form.Validator.adders = {
  validators: {},
  add: function (b, a) {
    this.validators[b] = new InputValidator(b, a);
    if (!this.initialize) {
      this.implement({ validators: this.validators });
    }
  },
  addAllThese: function (a) {
    Array.from(a).each(function (b) {
      this.add(b[0], b[1]);
    }, this);
  },
  getValidator: function (a) {
    return this.validators[a.split(":")[0]];
  },
};
Object.append(Form.Validator, Form.Validator.adders);
Form.Validator.implement(Form.Validator.adders);
Form.Validator.add("IsEmpty", {
  errorMsg: false,
  test: function (a) {
    if (a.type == "select-one" || a.type == "select") {
      return !(a.selectedIndex >= 0 && a.options[a.selectedIndex].value != "");
    } else {
      return a.get("value") == null || a.get("value").length == 0;
    }
  },
});
Form.Validator.addAllThese([
  [
    "required",
    {
      errorMsg: function () {
        return Form.Validator.getMsg("required");
      },
      test: function (a) {
        return !Form.Validator.getValidator("IsEmpty").test(a);
      },
    },
  ],
  [
    "length",
    {
      errorMsg: function (a, b) {
        if (typeOf(b.length) != "null") {
          return Form.Validator.getMsg("length").substitute({
            length: b.length,
            elLength: a.get("value").length,
          });
        } else {
          return "";
        }
      },
      test: function (a, b) {
        if (typeOf(b.length) != "null") {
          return (
            a.get("value").length == b.length || a.get("value").length == 0
          );
        } else {
          return true;
        }
      },
    },
  ],
  [
    "minLength",
    {
      errorMsg: function (a, b) {
        if (typeOf(b.minLength) != "null") {
          return Form.Validator.getMsg("minLength").substitute({
            minLength: b.minLength,
            length: a.get("value").length,
          });
        } else {
          return "";
        }
      },
      test: function (a, b) {
        if (typeOf(b.minLength) != "null") {
          return a.get("value").length >= (b.minLength || 0);
        } else {
          return true;
        }
      },
    },
  ],
  [
    "maxLength",
    {
      errorMsg: function (a, b) {
        if (typeOf(b.maxLength) != "null") {
          return Form.Validator.getMsg("maxLength").substitute({
            maxLength: b.maxLength,
            length: a.get("value").length,
          });
        } else {
          return "";
        }
      },
      test: function (a, b) {
        return a.get("value").length <= (b.maxLength || 10000);
      },
    },
  ],
  [
    "validate-integer",
    {
      errorMsg: Form.Validator.getMsg.pass("integer"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^(-?[1-9]\d*|0)$/.test(a.get("value"))
        );
      },
    },
  ],
  [
    "validate-numeric",
    {
      errorMsg: Form.Validator.getMsg.pass("numeric"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^-?(?:0$0(?=\d*\.)|[1-9]|0)\d*(\.\d+)?$/.test(a.get("value"))
        );
      },
    },
  ],
  [
    "validate-digits",
    {
      errorMsg: Form.Validator.getMsg.pass("digits"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^[\d() .:\-\+#]+$/.test(a.get("value"))
        );
      },
    },
  ],
  [
    "validate-alpha",
    {
      errorMsg: Form.Validator.getMsg.pass("alpha"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^[a-zA-Z]+$/.test(a.get("value"))
        );
      },
    },
  ],
  [
    "validate-alphanum",
    {
      errorMsg: Form.Validator.getMsg.pass("alphanum"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          !/\W/.test(a.get("value"))
        );
      },
    },
  ],
  [
    "validate-date",
    {
      errorMsg: function (a, b) {
        if (Date.parse) {
          var c = b.dateFormat || "%x";
          return Form.Validator.getMsg("dateSuchAs").substitute({
            date: new Date().format(c),
          });
        } else {
          return Form.Validator.getMsg("dateInFormatMDY");
        }
      },
      test: function (e, g) {
        if (Form.Validator.getValidator("IsEmpty").test(e)) {
          return true;
        }
        var a = Locale.getCurrent().sets.Date,
          b = new RegExp(
            [a.days, a.days_abbr, a.months, a.months_abbr].flatten().join("|"),
            "i"
          ),
          i = e.get("value"),
          f = i.match(/[a-z]+/gi);
        if (f && !f.every(b.exec, b)) {
          return false;
        }
        var c = Date.parse(i),
          h = g.dateFormat || "%x",
          d = c.format(h);
        if (d != "invalid date") {
          e.set("value", d);
        }
        return c.isValid();
      },
    },
  ],
  [
    "validate-email",
    {
      errorMsg: Form.Validator.getMsg.pass("email"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]\.?){0,63}[a-z0-9!#$%&'*+\/=?^_`{|}~-]@(?:(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\])$/i.test(
            a.get("value")
          )
        );
      },
    },
  ],
  [
    "validate-url",
    {
      errorMsg: Form.Validator.getMsg.pass("url"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^(https?|ftp|rmtp|mms):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)(:(\d+))?\/?/i.test(
            a.get("value")
          )
        );
      },
    },
  ],
  [
    "validate-currency-dollar",
    {
      errorMsg: Form.Validator.getMsg.pass("currencyDollar"),
      test: function (a) {
        return (
          Form.Validator.getValidator("IsEmpty").test(a) ||
          /^\$?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(
            a.get("value")
          )
        );
      },
    },
  ],
  [
    "validate-one-required",
    {
      errorMsg: Form.Validator.getMsg.pass("oneRequired"),
      test: function (a, b) {
        var c =
          document.id(b["validate-one-required"]) ||
          a.getParent(b["validate-one-required"]);
        return c.getElements("input").some(function (d) {
          if (["checkbox", "radio"].contains(d.get("type"))) {
            return d.get("checked");
          }
          return d.get("value");
        });
      },
    },
  ],
]);
Element.Properties.validator = {
  set: function (a) {
    this.get("validator").setOptions(a);
  },
  get: function () {
    var a = this.retrieve("validator");
    if (!a) {
      a = new Form.Validator(this);
      this.store("validator", a);
    }
    return a;
  },
};
Element.implement({
  validate: function (a) {
    if (a) {
      this.set("validator", a);
    }
    return this.get("validator").validate();
  },
});
Form.Validator.Inline = new Class({
  Extends: Form.Validator,
  options: {
    showError: function (a) {
      if (a.reveal) {
        a.reveal();
      } else {
        a.setStyle("display", "block");
      }
    },
    hideError: function (a) {
      if (a.dissolve) {
        a.dissolve();
      } else {
        a.setStyle("display", "none");
      }
    },
    scrollToErrorsOnSubmit: true,
    scrollToErrorsOnBlur: false,
    scrollToErrorsOnChange: false,
    scrollFxOptions: { transition: "quad:out", offset: { y: -20 } },
  },
  initialize: function (b, a) {
    this.parent(b, a);
    this.addEvent("onElementValidate", function (g, f, e, h) {
      var d = this.getValidator(e);
      if (!g && d.getError(f)) {
        if (h) {
          f.addClass("warning");
        }
        var c = this.makeAdvice(e, f, d.getError(f), h);
        this.insertAdvice(c, f);
        this.showAdvice(e, f);
      } else {
        this.hideAdvice(e, f);
      }
    });
  },
  makeAdvice: function (d, f, c, g) {
    var e = g ? this.warningPrefix : this.errorPrefix;
    e += this.options.useTitles ? f.title || c : c;
    var a = g ? "warning-advice" : "validation-advice";
    var b = this.getAdvice(d, f);
    if (b) {
      b = b.set("html", e);
    } else {
      b = new Element("div", {
        html: e,
        styles: { display: "none" },
        id: "advice-" + d.split(":")[0] + "-" + this.getFieldId(f),
      }).addClass(a);
    }
    f.store("$moo:advice-" + d, b);
    return b;
  },
  getFieldId: function (a) {
    return a.id ? a.id : (a.id = "input_" + a.name);
  },
  showAdvice: function (b, c) {
    var a = this.getAdvice(b, c);
    if (
      a &&
      !c.retrieve("$moo:" + this.getPropName(b)) &&
      (a.getStyle("display") == "none" ||
        a.getStyle("visiblity") == "hidden" ||
        a.getStyle("opacity") == 0)
    ) {
      c.store("$moo:" + this.getPropName(b), true);
      this.options.showError(a);
      this.fireEvent("showAdvice", [c, a, b]);
    }
  },
  hideAdvice: function (b, c) {
    var a = this.getAdvice(b, c);
    if (a && c.retrieve("$moo:" + this.getPropName(b))) {
      c.store("$moo:" + this.getPropName(b), false);
      this.options.hideError(a);
      this.fireEvent("hideAdvice", [c, a, b]);
    }
  },
  getPropName: function (a) {
    return "advice" + a;
  },
  resetField: function (a) {
    a = document.id(a);
    if (!a) {
      return this;
    }
    this.parent(a);
    a.get("validators").each(function (b) {
      this.hideAdvice(b, a);
    }, this);
    return this;
  },
  getAllAdviceMessages: function (d, c) {
    var b = [];
    if (d.hasClass("ignoreValidation") && !c) {
      return b;
    }
    var a = d.get("validators").some(function (g) {
      var e = g.test("^warn-") || d.hasClass("warnOnly");
      if (e) {
        g = g.replace(/^warn-/, "");
      }
      var f = this.getValidator(g);
      if (!f) {
        return;
      }
      b.push({
        message: f.getError(d),
        warnOnly: e,
        passed: f.test(),
        validator: f,
      });
    }, this);
    return b;
  },
  getAdvice: function (a, b) {
    return b.retrieve("$moo:advice-" + a);
  },
  insertAdvice: function (a, c) {
    var b = c.get("validatorProps");
    if (!b.msgPos || !document.id(b.msgPos)) {
      if (c.type && c.type.toLowerCase() == "radio") {
        c.getParent().adopt(a);
      } else {
        a.inject(document.id(c), "after");
      }
    } else {
      document.id(b.msgPos).grab(a);
    }
  },
  validateField: function (g, f, b) {
    var a = this.parent(g, f);
    if (((this.options.scrollToErrorsOnSubmit && b == null) || b) && !a) {
      var c = document.id(this).getElement(".validation-failed");
      var d = document.id(this).getParent();
      while (d != document.body && d.getScrollSize().y == d.getSize().y) {
        d = d.getParent();
      }
      var e = d.retrieve("$moo:fvScroller");
      if (!e && window.Fx && Fx.Scroll) {
        e = new Fx.Scroll(d, this.options.scrollFxOptions);
        d.store("$moo:fvScroller", e);
      }
      if (c) {
        if (e) {
          e.toElement(c);
        } else {
          d.scrollTo(d.getScroll().x, c.getPosition(d).y - 20);
        }
      }
    }
    return a;
  },
  watchFields: function (a) {
    a.each(function (b) {
      if (this.options.evaluateFieldsOnBlur) {
        b.addEvent(
          "blur",
          this.validationMonitor.pass(
            [b, false, this.options.scrollToErrorsOnBlur],
            this
          )
        );
      }
      if (this.options.evaluateFieldsOnChange) {
        b.addEvent(
          "change",
          this.validationMonitor.pass(
            [b, true, this.options.scrollToErrorsOnChange],
            this
          )
        );
      }
    }, this);
  },
});
Form.Validator.addAllThese([
  [
    "validate-enforce-oncheck",
    {
      test: function (a, b) {
        var c = a.getParent("form").retrieve("validator");
        if (!c) {
          return true;
        }
        (
          b.toEnforce ||
          document
            .id(b.enforceChildrenOf)
            .getElements("input, select, textarea")
        ).map(function (d) {
          if (a.checked) {
            c.enforceField(d);
          } else {
            c.ignoreField(d);
            c.resetField(d);
          }
        });
        return true;
      },
    },
  ],
  [
    "validate-ignore-oncheck",
    {
      test: function (a, b) {
        var c = a.getParent("form").retrieve("validator");
        if (!c) {
          return true;
        }
        (
          b.toIgnore ||
          document.id(b.ignoreChildrenOf).getElements("input, select, textarea")
        ).each(function (d) {
          if (a.checked) {
            c.ignoreField(d);
            c.resetField(d);
          } else {
            c.enforceField(d);
          }
        });
        return true;
      },
    },
  ],
  [
    "validate-nospace",
    {
      errorMsg: function () {
        return Form.Validator.getMsg("noSpace");
      },
      test: function (a, b) {
        return !a.get("value").test(/\s/);
      },
    },
  ],
  [
    "validate-toggle-oncheck",
    {
      test: function (b, c) {
        var d = b.getParent("form").retrieve("validator");
        if (!d) {
          return true;
        }
        var a =
          c.toToggle ||
          document
            .id(c.toToggleChildrenOf)
            .getElements("input, select, textarea");
        if (!b.checked) {
          a.each(function (e) {
            d.ignoreField(e);
            d.resetField(e);
          });
        } else {
          a.each(function (e) {
            d.enforceField(e);
          });
        }
        return true;
      },
    },
  ],
  [
    "validate-reqchk-bynode",
    {
      errorMsg: function () {
        return Form.Validator.getMsg("reqChkByNode");
      },
      test: function (a, b) {
        return document
          .id(b.nodeId)
          .getElements(b.selector || "input[type=checkbox], input[type=radio]")
          .some(function (c) {
            return c.checked;
          });
      },
    },
  ],
  [
    "validate-required-check",
    {
      errorMsg: function (a, b) {
        return b.useTitle
          ? a.get("title")
          : Form.Validator.getMsg("requiredChk");
      },
      test: function (a, b) {
        return !!a.checked;
      },
    },
  ],
  [
    "validate-reqchk-byname",
    {
      errorMsg: function (a, b) {
        return Form.Validator.getMsg("reqChkByName").substitute({
          label: b.label || a.get("type"),
        });
      },
      test: function (b, d) {
        var c = d.groupName || b.get("name");
        var a = $$(document.getElementsByName(c)).some(function (g, f) {
          return g.checked;
        });
        var e = b.getParent("form").retrieve("validator");
        if (a && e) {
          e.resetField(b);
        }
        return a;
      },
    },
  ],
  [
    "validate-match",
    {
      errorMsg: function (a, b) {
        return Form.Validator.getMsg("match").substitute({
          matchName: b.matchName || document.id(b.matchInput).get("name"),
        });
      },
      test: function (b, c) {
        var d = b.get("value");
        var a =
          document.id(c.matchInput) && document.id(c.matchInput).get("value");
        return d && a ? d == a : true;
      },
    },
  ],
  [
    "validate-after-date",
    {
      errorMsg: function (a, b) {
        return Form.Validator.getMsg("afterDate").substitute({
          label:
            b.afterLabel ||
            (b.afterElement
              ? Form.Validator.getMsg("startDate")
              : Form.Validator.getMsg("currentDate")),
        });
      },
      test: function (b, c) {
        var d = document.id(c.afterElement)
          ? Date.parse(document.id(c.afterElement).get("value"))
          : new Date();
        var a = Date.parse(b.get("value"));
        return a && d ? a >= d : true;
      },
    },
  ],
  [
    "validate-before-date",
    {
      errorMsg: function (a, b) {
        return Form.Validator.getMsg("beforeDate").substitute({
          label:
            b.beforeLabel ||
            (b.beforeElement
              ? Form.Validator.getMsg("endDate")
              : Form.Validator.getMsg("currentDate")),
        });
      },
      test: function (b, c) {
        var d = Date.parse(b.get("value"));
        var a = document.id(c.beforeElement)
          ? Date.parse(document.id(c.beforeElement).get("value"))
          : new Date();
        return a && d ? a >= d : true;
      },
    },
  ],
  [
    "validate-custom-required",
    {
      errorMsg: function () {
        return Form.Validator.getMsg("required");
      },
      test: function (a, b) {
        return a.get("value") != b.emptyValue;
      },
    },
  ],
  [
    "validate-same-month",
    {
      errorMsg: function (a, b) {
        var c =
          document.id(b.sameMonthAs) && document.id(b.sameMonthAs).get("value");
        var d = a.get("value");
        if (d != "") {
          return Form.Validator.getMsg(c ? "sameMonth" : "startMonth");
        }
      },
      test: function (a, b) {
        var d = Date.parse(a.get("value"));
        var c = Date.parse(
          document.id(b.sameMonthAs) && document.id(b.sameMonthAs).get("value")
        );
        return d && c ? d.format("%B") == c.format("%B") : true;
      },
    },
  ],
  [
    "validate-cc-num",
    {
      errorMsg: function (a) {
        var b = a.get("value").replace(/[^0-9]/g, "");
        return Form.Validator.getMsg("creditcard").substitute({
          length: b.length,
        });
      },
      test: function (c) {
        if (Form.Validator.getValidator("IsEmpty").test(c)) {
          return true;
        }
        var g = c.get("value");
        g = g.replace(/[^0-9]/g, "");
        var a = false;
        if (g.test(/^4[0-9]{12}([0-9]{3})?$/)) {
          a = "Visa";
        } else {
          if (g.test(/^5[1-5]([0-9]{14})$/)) {
            a = "Master Card";
          } else {
            if (g.test(/^3[47][0-9]{13}$/)) {
              a = "American Express";
            } else {
              if (g.test(/^6011[0-9]{12}$/)) {
                a = "Discover";
              }
            }
          }
        }
        if (a) {
          var d = 0;
          var e = 0;
          for (var b = g.length - 1; b >= 0; --b) {
            e = g.charAt(b).toInt();
            if (e == 0) {
              continue;
            }
            if ((g.length - b) % 2 == 0) {
              e += e;
            }
            if (e > 9) {
              e =
                e.toString().charAt(0).toInt() + e.toString().charAt(1).toInt();
            }
            d += e;
          }
          if (d % 10 == 0) {
            return true;
          }
        }
        var f = "";
        while (g != "") {
          f += " " + g.substr(0, 4);
          g = g.substr(4);
        }
        c.getParent("form").retrieve("validator").ignoreField(c);
        c.set("value", f.clean());
        c.getParent("form").retrieve("validator").enforceField(c);
        return false;
      },
    },
  ],
]);
var OverText = new Class({
  Implements: [Options, Events, Class.Occlude],
  Binds: ["reposition", "assert", "focus", "hide"],
  options: {
    element: "label",
    labelClass: "overTxtLabel",
    positionOptions: {
      position: "upperLeft",
      edge: "upperLeft",
      offset: { x: 4, y: 2 },
    },
    poll: false,
    pollInterval: 250,
    wrap: false,
  },
  property: "OverText",
  initialize: function (b, a) {
    b = this.element = document.id(b);
    if (this.occlude()) {
      return this.occluded;
    }
    this.setOptions(a);
    this.attach(b);
    OverText.instances.push(this);
    if (this.options.poll) {
      this.poll();
    }
  },
  toElement: function () {
    return this.element;
  },
  attach: function () {
    var b = this.element,
      a = this.options,
      c = a.textOverride || b.get("alt") || b.get("title");
    if (!c) {
      return this;
    }
    var d = (this.text = new Element(a.element, {
      class: a.labelClass,
      styles: { lineHeight: "normal", position: "absolute", cursor: "text" },
      html: c,
      events: { click: this.hide.pass(a.element == "label", this) },
    }).inject(b, "after"));
    if (a.element == "label") {
      if (!b.get("id")) {
        b.set("id", "input_" + String.uniqueID());
      }
      d.set("for", b.get("id"));
    }
    if (a.wrap) {
      this.textHolder = new Element("div.overTxtWrapper", {
        styles: { lineHeight: "normal", position: "relative" },
      })
        .grab(d)
        .inject(b, "before");
    }
    return this.enable();
  },
  destroy: function () {
    this.element.eliminate(this.property);
    this.disable();
    if (this.text) {
      this.text.destroy();
    }
    if (this.textHolder) {
      this.textHolder.destroy();
    }
    return this;
  },
  disable: function () {
    this.element.removeEvents({
      focus: this.focus,
      blur: this.assert,
      change: this.assert,
    });
    window.removeEvent("resize", this.reposition);
    this.hide(true, true);
    return this;
  },
  enable: function () {
    this.element.addEvents({
      focus: this.focus,
      blur: this.assert,
      change: this.assert,
    });
    window.addEvent("resize", this.reposition);
    this.reposition();
    return this;
  },
  wrap: function () {
    if (this.options.element == "label") {
      if (!this.element.get("id")) {
        this.element.set("id", "input_" + String.uniqueID());
      }
      this.text.set("for", this.element.get("id"));
    }
  },
  startPolling: function () {
    this.pollingPaused = false;
    return this.poll();
  },
  poll: function (a) {
    if (this.poller && !a) {
      return this;
    }
    if (a) {
      clearInterval(this.poller);
    } else {
      this.poller = function () {
        if (!this.pollingPaused) {
          this.assert(true);
        }
      }.periodical(this.options.pollInterval, this);
    }
    return this;
  },
  stopPolling: function () {
    this.pollingPaused = true;
    return this.poll(true);
  },
  focus: function () {
    if (
      this.text &&
      (!this.text.isDisplayed() || this.element.get("disabled"))
    ) {
      return this;
    }
    return this.hide();
  },
  hide: function (c, a) {
    if (
      this.text &&
      this.text.isDisplayed() &&
      (!this.element.get("disabled") || a)
    ) {
      this.text.hide();
      this.fireEvent("textHide", [this.text, this.element]);
      this.pollingPaused = true;
      if (!c) {
        try {
          this.element.fireEvent("focus");
          this.element.focus();
        } catch (b) {}
      }
    }
    return this;
  },
  show: function () {
    if (this.text && !this.text.isDisplayed()) {
      this.text.show();
      this.reposition();
      this.fireEvent("textShow", [this.text, this.element]);
      this.pollingPaused = false;
    }
    return this;
  },
  test: function () {
    return !this.element.get("value");
  },
  assert: function (a) {
    return this[this.test() ? "show" : "hide"](a);
  },
  reposition: function () {
    this.assert(true);
    if (!this.element.isVisible()) {
      return this.stopPolling().hide();
    }
    if (this.text && this.test()) {
      this.text.position(
        Object.merge(this.options.positionOptions, { relativeTo: this.element })
      );
    }
    return this;
  },
});
OverText.instances = [];
Object.append(OverText, {
  each: function (a) {
    return OverText.instances.each(function (c, b) {
      if (c.element && c.text) {
        a.call(OverText, c, b);
      }
    });
  },
  update: function () {
    return OverText.each(function (a) {
      return a.reposition();
    });
  },
  hideAll: function () {
    return OverText.each(function (a) {
      return a.hide(true, true);
    });
  },
  showAll: function () {
    return OverText.each(function (a) {
      return a.show();
    });
  },
});
Fx.Elements = new Class({
  Extends: Fx.CSS,
  initialize: function (b, a) {
    this.elements = this.subject = $$(b);
    this.parent(a);
  },
  compute: function (g, h, j) {
    var c = {};
    for (var d in g) {
      var a = g[d],
        e = h[d],
        f = (c[d] = {});
      for (var b in a) {
        f[b] = this.parent(a[b], e[b], j);
      }
    }
    return c;
  },
  set: function (b) {
    for (var c in b) {
      if (!this.elements[c]) {
        continue;
      }
      var a = b[c];
      for (var d in a) {
        this.render(this.elements[c], d, a[d], this.options.unit);
      }
    }
    return this;
  },
  start: function (c) {
    if (!this.check(c)) {
      return this;
    }
    var h = {},
      j = {};
    for (var d in c) {
      if (!this.elements[d]) {
        continue;
      }
      var f = c[d],
        a = (h[d] = {}),
        g = (j[d] = {});
      for (var b in f) {
        var e = this.prepare(this.elements[d], b, f[b]);
        a[b] = e.from;
        g[b] = e.to;
      }
    }
    return this.parent(h, j);
  },
});
Fx.Accordion = new Class({
  Extends: Fx.Elements,
  options: {
    fixedHeight: false,
    fixedWidth: false,
    display: 0,
    show: false,
    height: true,
    width: false,
    opacity: true,
    alwaysHide: false,
    trigger: "click",
    initialDisplayFx: true,
    resetHeight: true,
  },
  initialize: function () {
    var g = function (h) {
      return h != null;
    };
    var f = Array.link(arguments, {
      container: Type.isElement,
      options: Type.isObject,
      togglers: g,
      elements: g,
    });
    this.parent(f.elements, f.options);
    var b = this.options,
      e = (this.togglers = $$(f.togglers));
    this.previous = -1;
    this.internalChain = new Chain();
    if (b.alwaysHide) {
      this.options.link = "chain";
    }
    if (b.show || this.options.show === 0) {
      b.display = false;
      this.previous = b.show;
    }
    if (b.start) {
      b.display = false;
      b.show = false;
    }
    var d = (this.effects = {});
    if (b.opacity) {
      d.opacity = "fullOpacity";
    }
    if (b.width) {
      d.width = b.fixedWidth ? "fullWidth" : "offsetWidth";
    }
    if (b.height) {
      d.height = b.fixedHeight ? "fullHeight" : "scrollHeight";
    }
    for (var c = 0, a = e.length; c < a; c++) {
      this.addSection(e[c], this.elements[c]);
    }
    this.elements.each(function (j, h) {
      if (b.show === h) {
        this.fireEvent("active", [e[h], j]);
      } else {
        for (var k in d) {
          j.setStyle(k, 0);
        }
      }
    }, this);
    if (b.display || b.display === 0 || b.initialDisplayFx === false) {
      this.display(b.display, b.initialDisplayFx);
    }
    if (b.fixedHeight !== false) {
      b.resetHeight = false;
    }
    this.addEvent(
      "complete",
      this.internalChain.callChain.bind(this.internalChain)
    );
  },
  addSection: function (g, d) {
    g = document.id(g);
    d = document.id(d);
    this.togglers.include(g);
    this.elements.include(d);
    var f = this.togglers,
      c = this.options,
      h = f.contains(g),
      a = f.indexOf(g),
      b = this.display.pass(a, this);
    g.store("accordion:display", b).addEvent(c.trigger, b);
    if (c.height) {
      d.setStyles({
        "padding-top": 0,
        "border-top": "none",
        "padding-bottom": 0,
        "border-bottom": "none",
      });
    }
    if (c.width) {
      d.setStyles({
        "padding-left": 0,
        "border-left": "none",
        "padding-right": 0,
        "border-right": "none",
      });
    }
    d.fullOpacity = 1;
    if (c.fixedWidth) {
      d.fullWidth = c.fixedWidth;
    }
    if (c.fixedHeight) {
      d.fullHeight = c.fixedHeight;
    }
    d.setStyle("overflow", "hidden");
    if (!h) {
      for (var e in this.effects) {
        d.setStyle(e, 0);
      }
    }
    return this;
  },
  removeSection: function (f, b) {
    var e = this.togglers,
      a = e.indexOf(f),
      c = this.elements[a];
    var d = function () {
      e.erase(f);
      this.elements.erase(c);
      this.detach(f);
    }.bind(this);
    if (this.now == a || b != null) {
      this.display(b != null ? b : a - 1 >= 0 ? a - 1 : 0).chain(d);
    } else {
      d();
    }
    return this;
  },
  detach: function (b) {
    var a = function (c) {
      c.removeEvent(this.options.trigger, c.retrieve("accordion:display"));
    }.bind(this);
    if (!b) {
      this.togglers.each(a);
    } else {
      a(b);
    }
    return this;
  },
  display: function (b, c) {
    if (!this.check(b, c)) {
      return this;
    }
    var h = {},
      g = this.elements,
      a = this.options,
      f = this.effects;
    if (c == null) {
      c = true;
    }
    if (typeOf(b) == "element") {
      b = g.indexOf(b);
    }
    if (b == this.previous && !a.alwaysHide) {
      return this;
    }
    if (a.resetHeight) {
      var e = g[this.previous];
      if (e && !this.selfHidden) {
        for (var d in f) {
          e.setStyle(d, e[f[d]]);
        }
      }
    }
    if (
      (this.timer && a.link == "chain") ||
      (b === this.previous && !a.alwaysHide)
    ) {
      return this;
    }
    this.previous = b;
    this.selfHidden = false;
    g.each(function (l, k) {
      h[k] = {};
      var j;
      if (k != b) {
        j = true;
      } else {
        if (
          a.alwaysHide &&
          ((l.offsetHeight > 0 && a.height) || (l.offsetWidth > 0 && a.width))
        ) {
          j = true;
          this.selfHidden = true;
        }
      }
      this.fireEvent(j ? "background" : "active", [this.togglers[k], l]);
      for (var m in f) {
        h[k][m] = j ? 0 : l[f[m]];
      }
      if (!c && !j && a.resetHeight) {
        h[k].height = "auto";
      }
    }, this);
    this.internalChain.clearChain();
    this.internalChain.chain(
      function () {
        if (a.resetHeight && !this.selfHidden) {
          var i = g[b];
          if (i) {
            i.setStyle("height", "auto");
          }
        }
      }.bind(this)
    );
    return c ? this.start(h) : this.set(h).internalChain.callChain();
  },
});
Fx.Move = new Class({
  Extends: Fx.Morph,
  options: {
    relativeTo: document.body,
    position: "center",
    edge: false,
    offset: { x: 0, y: 0 },
  },
  start: function (a) {
    var b = this.element,
      c = b.getStyles("top", "left");
    if (c.top == "auto" || c.left == "auto") {
      b.setPosition(b.getPosition(b.getOffsetParent()));
    }
    return this.parent(
      b.position(Object.merge({}, this.options, a, { returnPos: true }))
    );
  },
});
Element.Properties.move = {
  set: function (a) {
    this.get("move").cancel().setOptions(a);
    return this;
  },
  get: function () {
    var a = this.retrieve("move");
    if (!a) {
      a = new Fx.Move(this, { link: "cancel" });
      this.store("move", a);
    }
    return a;
  },
};
Element.implement({
  move: function (a) {
    this.get("move").start(a);
    return this;
  },
});
(function () {
  Fx.Scroll = new Class({
    Extends: Fx,
    options: { offset: { x: 0, y: 0 }, wheelStops: true },
    initialize: function (c, b) {
      this.element = this.subject = document.id(c);
      this.parent(b);
      if (typeOf(this.element) != "element") {
        this.element = document.id(this.element.getDocument().body);
      }
      if (this.options.wheelStops) {
        var d = this.element,
          e = this.cancel.pass(false, this);
        this.addEvent(
          "start",
          function () {
            d.addEvent("mousewheel", e);
          },
          true
        );
        this.addEvent(
          "complete",
          function () {
            d.removeEvent("mousewheel", e);
          },
          true
        );
      }
    },
    set: function () {
      var b = Array.flatten(arguments);
      if (Browser.firefox) {
        b = [Math.round(b[0]), Math.round(b[1])];
      }
      this.element.scrollTo(b[0], b[1]);
      return this;
    },
    compute: function (d, c, b) {
      return [0, 1].map(function (e) {
        return Fx.compute(d[e], c[e], b);
      });
    },
    start: function (c, d) {
      if (!this.check(c, d)) {
        return this;
      }
      var b = this.element.getScroll();
      return this.parent([b.x, b.y], [c, d]);
    },
    calculateScroll: function (g, f) {
      var d = this.element,
        b = d.getScrollSize(),
        h = d.getScroll(),
        j = d.getSize(),
        c = this.options.offset,
        i = { x: g, y: f };
      for (var e in i) {
        if (!i[e] && i[e] !== 0) {
          i[e] = h[e];
        }
        if (typeOf(i[e]) != "number") {
          i[e] = b[e] - j[e];
        }
        i[e] += c[e];
      }
      return [i.x, i.y];
    },
    toTop: function () {
      return this.start.apply(this, this.calculateScroll(false, 0));
    },
    toLeft: function () {
      return this.start.apply(this, this.calculateScroll(0, false));
    },
    toRight: function () {
      return this.start.apply(this, this.calculateScroll("right", false));
    },
    toBottom: function () {
      return this.start.apply(this, this.calculateScroll(false, "bottom"));
    },
    toElement: function (d, e) {
      e = e ? Array.from(e) : ["x", "y"];
      var c = a(this.element) ? { x: 0, y: 0 } : this.element.getScroll();
      var b = Object.map(
        document.id(d).getPosition(this.element),
        function (g, f) {
          return e.contains(f) ? g + c[f] : false;
        }
      );
      return this.start.apply(this, this.calculateScroll(b.x, b.y));
    },
    toElementEdge: function (d, g, e) {
      g = g ? Array.from(g) : ["x", "y"];
      d = document.id(d);
      var i = {},
        f = d.getPosition(this.element),
        j = d.getSize(),
        h = this.element.getScroll(),
        b = this.element.getSize(),
        c = { x: f.x + j.x, y: f.y + j.y };
      ["x", "y"].each(function (k) {
        if (g.contains(k)) {
          if (c[k] > h[k] + b[k]) {
            i[k] = c[k] - b[k];
          }
          if (f[k] < h[k]) {
            i[k] = f[k];
          }
        }
        if (i[k] == null) {
          i[k] = h[k];
        }
        if (e && e[k]) {
          i[k] = i[k] + e[k];
        }
      }, this);
      if (i.x != h.x || i.y != h.y) {
        this.start(i.x, i.y);
      }
      return this;
    },
    toElementCenter: function (e, f, h) {
      f = f ? Array.from(f) : ["x", "y"];
      e = document.id(e);
      var i = {},
        c = e.getPosition(this.element),
        d = e.getSize(),
        b = this.element.getScroll(),
        g = this.element.getSize();
      ["x", "y"].each(function (j) {
        if (f.contains(j)) {
          i[j] = c[j] - (g[j] - d[j]) / 2;
        }
        if (i[j] == null) {
          i[j] = b[j];
        }
        if (h && h[j]) {
          i[j] = i[j] + h[j];
        }
      }, this);
      if (i.x != b.x || i.y != b.y) {
        this.start(i.x, i.y);
      }
      return this;
    },
  });
  function a(b) {
    return /^(?:body|html)$/i.test(b.tagName);
  }
})();
Fx.Slide = new Class({
  Extends: Fx,
  options: {
    mode: "vertical",
    wrapper: false,
    hideOverflow: true,
    resetHeight: false,
  },
  initialize: function (b, a) {
    b = this.element = this.subject = document.id(b);
    this.parent(a);
    a = this.options;
    var d = b.retrieve("wrapper"),
      c = b.getStyles("margin", "position", "overflow");
    if (a.hideOverflow) {
      c = Object.append(c, { overflow: "hidden" });
    }
    if (a.wrapper) {
      d = document.id(a.wrapper).setStyles(c);
    }
    if (!d) {
      d = new Element("div", { styles: c }).wraps(b);
    }
    b.store("wrapper", d).setStyle("margin", 0);
    if (b.getStyle("overflow") == "visible") {
      b.setStyle("overflow", "hidden");
    }
    this.now = [];
    this.open = true;
    this.wrapper = d;
    this.addEvent(
      "complete",
      function () {
        this.open = d["offset" + this.layout.capitalize()] != 0;
        if (this.open && this.options.resetHeight) {
          d.setStyle("height", "");
        }
      },
      true
    );
  },
  vertical: function () {
    this.margin = "margin-top";
    this.layout = "height";
    this.offset = this.element.offsetHeight;
  },
  horizontal: function () {
    this.margin = "margin-left";
    this.layout = "width";
    this.offset = this.element.offsetWidth;
  },
  set: function (a) {
    this.element.setStyle(this.margin, a[0]);
    this.wrapper.setStyle(this.layout, a[1]);
    return this;
  },
  compute: function (c, b, a) {
    return [0, 1].map(function (d) {
      return Fx.compute(c[d], b[d], a);
    });
  },
  start: function (b, e) {
    if (!this.check(b, e)) {
      return this;
    }
    this[e || this.options.mode]();
    var d = this.element.getStyle(this.margin).toInt(),
      c = this.wrapper.getStyle(this.layout).toInt(),
      a = [
        [d, c],
        [0, this.offset],
      ],
      g = [
        [d, c],
        [-this.offset, 0],
      ],
      f;
    switch (b) {
      case "in":
        f = a;
        break;
      case "out":
        f = g;
        break;
      case "toggle":
        f = c == 0 ? a : g;
    }
    return this.parent(f[0], f[1]);
  },
  slideIn: function (a) {
    return this.start("in", a);
  },
  slideOut: function (a) {
    return this.start("out", a);
  },
  hide: function (a) {
    this[a || this.options.mode]();
    this.open = false;
    return this.set([-this.offset, 0]);
  },
  show: function (a) {
    this[a || this.options.mode]();
    this.open = true;
    return this.set([0, this.offset]);
  },
  toggle: function (a) {
    return this.start("toggle", a);
  },
});
Element.Properties.slide = {
  set: function (a) {
    this.get("slide").cancel().setOptions(a);
    return this;
  },
  get: function () {
    var a = this.retrieve("slide");
    if (!a) {
      a = new Fx.Slide(this, { link: "cancel" });
      this.store("slide", a);
    }
    return a;
  },
};
Element.implement({
  slide: function (d, e) {
    d = d || "toggle";
    var b = this.get("slide"),
      a;
    switch (d) {
      case "hide":
        b.hide(e);
        break;
      case "show":
        b.show(e);
        break;
      case "toggle":
        var c = this.retrieve("slide:flag", b.open);
        b[c ? "slideOut" : "slideIn"](e);
        this.store("slide:flag", !c);
        a = true;
        break;
      default:
        b.start(d, e);
    }
    if (!a) {
      this.eliminate("slide:flag");
    }
    return this;
  },
});
Fx.SmoothScroll = new Class({
  Extends: Fx.Scroll,
  options: { axes: ["x", "y"] },
  initialize: function (c, d) {
    d = d || document;
    this.doc = d.getDocument();
    this.parent(this.doc, c);
    var e = d.getWindow(),
      a = e.location.href.match(/^[^#]*/)[0] + "#",
      b = $$(this.options.links || this.doc.links);
    b.each(function (g) {
      if (g.href.indexOf(a) != 0) {
        return;
      }
      var f = g.href.substr(a.length);
      if (f) {
        this.useLink(g, f);
      }
    }, this);
    this.addEvent(
      "complete",
      function () {
        e.location.hash = this.anchor;
        this.element.scrollTo(this.to[0], this.to[1]);
      },
      true
    );
  },
  useLink: function (b, a) {
    b.addEvent(
      "click",
      function (d) {
        var c = document.id(a) || this.doc.getElement("a[name=" + a + "]");
        if (!c) {
          return;
        }
        d.preventDefault();
        this.toElement(c, this.options.axes).chain(
          function () {
            this.fireEvent("scrolledTo", [b, c]);
          }.bind(this)
        );
        this.anchor = a;
      }.bind(this)
    );
    return this;
  },
});
Fx.Sort = new Class({
  Extends: Fx.Elements,
  options: { mode: "vertical" },
  initialize: function (b, a) {
    this.parent(b, a);
    this.elements.each(function (c) {
      if (c.getStyle("position") == "static") {
        c.setStyle("position", "relative");
      }
    });
    this.setDefaultOrder();
  },
  setDefaultOrder: function () {
    this.currentOrder = this.elements.map(function (b, a) {
      return a;
    });
  },
  sort: function () {
    if (!this.check(arguments)) {
      return this;
    }
    var e = Array.flatten(arguments);
    var i = 0,
      a = 0,
      c = {},
      h = {},
      d = this.options.mode == "vertical";
    var f = this.elements.map(function (m, k) {
      var l = m.getComputedSize({ styles: ["border", "padding", "margin"] });
      var n;
      if (d) {
        n = { top: i, margin: l["margin-top"], height: l.totalHeight };
        i += n.height - l["margin-top"];
      } else {
        n = { left: a, margin: l["margin-left"], width: l.totalWidth };
        a += n.width;
      }
      var j = d ? "top" : "left";
      h[k] = {};
      var o = m.getStyle(j).toInt();
      h[k][j] = o || 0;
      return n;
    }, this);
    this.set(h);
    e = e.map(function (j) {
      return j.toInt();
    });
    if (e.length != this.elements.length) {
      this.currentOrder.each(function (j) {
        if (!e.contains(j)) {
          e.push(j);
        }
      });
      if (e.length > this.elements.length) {
        e.splice(this.elements.length - 1, e.length - this.elements.length);
      }
    }
    var b = 0;
    i = a = 0;
    e.each(function (k) {
      var j = {};
      if (d) {
        j.top = i - f[k].top - b;
        i += f[k].height;
      } else {
        j.left = a - f[k].left;
        a += f[k].width;
      }
      b = b + f[k].margin;
      c[k] = j;
    }, this);
    var g = {};
    Array.clone(e)
      .sort()
      .each(function (j) {
        g[j] = c[j];
      });
    this.start(g);
    this.currentOrder = e;
    return this;
  },
  rearrangeDOM: function (a) {
    a = a || this.currentOrder;
    var b = this.elements[0].getParent();
    var c = [];
    this.elements.setStyle("opacity", 0);
    a.each(function (d) {
      c.push(this.elements[d].inject(b).setStyles({ top: 0, left: 0 }));
    }, this);
    this.elements.setStyle("opacity", 1);
    this.elements = $$(c);
    this.setDefaultOrder();
    return this;
  },
  getDefaultOrder: function () {
    return this.elements.map(function (b, a) {
      return a;
    });
  },
  getCurrentOrder: function () {
    return this.currentOrder;
  },
  forward: function () {
    return this.sort(this.getDefaultOrder());
  },
  backward: function () {
    return this.sort(this.getDefaultOrder().reverse());
  },
  reverse: function () {
    return this.sort(this.currentOrder.reverse());
  },
  sortByElements: function (a) {
    return this.sort(
      a.map(function (b) {
        return this.elements.indexOf(b);
      }, this)
    );
  },
  swap: function (c, b) {
    if (typeOf(c) == "element") {
      c = this.elements.indexOf(c);
    }
    if (typeOf(b) == "element") {
      b = this.elements.indexOf(b);
    }
    var a = Array.clone(this.currentOrder);
    a[this.currentOrder.indexOf(c)] = b;
    a[this.currentOrder.indexOf(b)] = c;
    return this.sort(a);
  },
});
var Drag = new Class({
  Implements: [Events, Options],
  options: {
    snap: 6,
    unit: "px",
    grid: false,
    style: true,
    limit: false,
    handle: false,
    invert: false,
    preventDefault: false,
    stopPropagation: false,
    modifiers: { x: "left", y: "top" },
  },
  initialize: function () {
    var b = Array.link(arguments, {
      options: Type.isObject,
      element: function (c) {
        return c != null;
      },
    });
    this.element = document.id(b.element);
    this.document = this.element.getDocument();
    this.setOptions(b.options || {});
    var a = typeOf(this.options.handle);
    this.handles =
      (a == "array" || a == "collection"
        ? $$(this.options.handle)
        : document.id(this.options.handle)) || this.element;
    this.mouse = { now: {}, pos: {} };
    this.value = { start: {}, now: {} };
    this.selection = Browser.ie ? "selectstart" : "mousedown";
    if (Browser.ie && !Drag.ondragstartFixed) {
      document.ondragstart = Function.from(false);
      Drag.ondragstartFixed = true;
    }
    this.bound = {
      start: this.start.bind(this),
      check: this.check.bind(this),
      drag: this.drag.bind(this),
      stop: this.stop.bind(this),
      cancel: this.cancel.bind(this),
      eventStop: Function.from(false),
    };
    this.attach();
  },
  attach: function () {
    this.handles.addEvent("mousedown", this.bound.start);
    return this;
  },
  detach: function () {
    this.handles.removeEvent("mousedown", this.bound.start);
    return this;
  },
  start: function (a) {
    var j = this.options;
    if (a.rightClick) {
      return;
    }
    if (j.preventDefault) {
      a.preventDefault();
    }
    if (j.stopPropagation) {
      a.stopPropagation();
    }
    this.mouse.start = a.page;
    this.fireEvent("beforeStart", this.element);
    var c = j.limit;
    this.limit = { x: [], y: [] };
    var e, g;
    for (e in j.modifiers) {
      if (!j.modifiers[e]) {
        continue;
      }
      var b = this.element.getStyle(j.modifiers[e]);
      if (b && !b.match(/px$/)) {
        if (!g) {
          g = this.element.getCoordinates(this.element.getOffsetParent());
        }
        b = g[j.modifiers[e]];
      }
      if (j.style) {
        this.value.now[e] = (b || 0).toInt();
      } else {
        this.value.now[e] = this.element[j.modifiers[e]];
      }
      if (j.invert) {
        this.value.now[e] *= -1;
      }
      this.mouse.pos[e] = a.page[e] - this.value.now[e];
      if (c && c[e]) {
        var d = 2;
        while (d--) {
          var f = c[e][d];
          if (f || f === 0) {
            this.limit[e][d] = typeof f == "function" ? f() : f;
          }
        }
      }
    }
    if (typeOf(this.options.grid) == "number") {
      this.options.grid = { x: this.options.grid, y: this.options.grid };
    }
    var h = { mousemove: this.bound.check, mouseup: this.bound.cancel };
    h[this.selection] = this.bound.eventStop;
    this.document.addEvents(h);
  },
  check: function (a) {
    if (this.options.preventDefault) {
      a.preventDefault();
    }
    var b = Math.round(
      Math.sqrt(
        Math.pow(a.page.x - this.mouse.start.x, 2) +
          Math.pow(a.page.y - this.mouse.start.y, 2)
      )
    );
    if (b > this.options.snap) {
      this.cancel();
      this.document.addEvents({
        mousemove: this.bound.drag,
        mouseup: this.bound.stop,
      });
      this.fireEvent("start", [this.element, a]).fireEvent(
        "snap",
        this.element
      );
    }
  },
  drag: function (b) {
    var a = this.options;
    if (a.preventDefault) {
      b.preventDefault();
    }
    this.mouse.now = b.page;
    for (var c in a.modifiers) {
      if (!a.modifiers[c]) {
        continue;
      }
      this.value.now[c] = this.mouse.now[c] - this.mouse.pos[c];
      if (a.invert) {
        this.value.now[c] *= -1;
      }
      if (a.limit && this.limit[c]) {
        if (
          (this.limit[c][1] || this.limit[c][1] === 0) &&
          this.value.now[c] > this.limit[c][1]
        ) {
          this.value.now[c] = this.limit[c][1];
        } else {
          if (
            (this.limit[c][0] || this.limit[c][0] === 0) &&
            this.value.now[c] < this.limit[c][0]
          ) {
            this.value.now[c] = this.limit[c][0];
          }
        }
      }
      if (a.grid[c]) {
        this.value.now[c] -=
          (this.value.now[c] - (this.limit[c][0] || 0)) % a.grid[c];
      }
      if (a.style) {
        this.element.setStyle(a.modifiers[c], this.value.now[c] + a.unit);
      } else {
        this.element[a.modifiers[c]] = this.value.now[c];
      }
    }
    this.fireEvent("drag", [this.element, b]);
  },
  cancel: function (a) {
    this.document.removeEvents({
      mousemove: this.bound.check,
      mouseup: this.bound.cancel,
    });
    if (a) {
      this.document.removeEvent(this.selection, this.bound.eventStop);
      this.fireEvent("cancel", this.element);
    }
  },
  stop: function (b) {
    var a = { mousemove: this.bound.drag, mouseup: this.bound.stop };
    a[this.selection] = this.bound.eventStop;
    this.document.removeEvents(a);
    if (b) {
      this.fireEvent("complete", [this.element, b]);
    }
  },
});
Element.implement({
  makeResizable: function (a) {
    var b = new Drag(
      this,
      Object.merge({ modifiers: { x: "width", y: "height" } }, a)
    );
    this.store("resizer", b);
    return b.addEvent(
      "drag",
      function () {
        this.fireEvent("resize", b);
      }.bind(this)
    );
  },
});
Drag.Move = new Class({
  Extends: Drag,
  options: {
    droppables: [],
    container: false,
    precalculate: false,
    includeMargins: true,
    checkDroppables: true,
  },
  initialize: function (b, a) {
    this.parent(b, a);
    b = this.element;
    this.droppables = $$(this.options.droppables);
    this.container = document.id(this.options.container);
    if (this.container && typeOf(this.container) != "element") {
      this.container = document.id(this.container.getDocument().body);
    }
    if (this.options.style) {
      if (
        this.options.modifiers.x == "left" &&
        this.options.modifiers.y == "top"
      ) {
        var c = b.getOffsetParent(),
          d = b.getStyles("left", "top");
        if (c && (d.left == "auto" || d.top == "auto")) {
          b.setPosition(b.getPosition(c));
        }
      }
      if (b.getStyle("position") == "static") {
        b.setStyle("position", "absolute");
      }
    }
    this.addEvent("start", this.checkDroppables, true);
    this.overed = null;
  },
  start: function (a) {
    if (this.container) {
      this.options.limit = this.calculateLimit();
    }
    if (this.options.precalculate) {
      this.positions = this.droppables.map(function (b) {
        return b.getCoordinates();
      });
    }
    this.parent(a);
  },
  calculateLimit: function () {
    var j = this.element,
      e = this.container,
      d = document.id(j.getOffsetParent()) || document.body,
      h = e.getCoordinates(d),
      c = {},
      b = {},
      k = {},
      g = {},
      m = {};
    ["top", "right", "bottom", "left"].each(function (q) {
      c[q] = j.getStyle("margin-" + q).toInt();
      b[q] = j.getStyle("border-" + q).toInt();
      k[q] = e.getStyle("margin-" + q).toInt();
      g[q] = e.getStyle("border-" + q).toInt();
      m[q] = d.getStyle("padding-" + q).toInt();
    }, this);
    var f = j.offsetWidth + c.left + c.right,
      p = j.offsetHeight + c.top + c.bottom,
      i = 0,
      l = 0,
      o = h.right - g.right - f,
      a = h.bottom - g.bottom - p;
    if (this.options.includeMargins) {
      i += c.left;
      l += c.top;
    } else {
      o += c.right;
      a += c.bottom;
    }
    if (j.getStyle("position") == "relative") {
      var n = j.getCoordinates(d);
      n.left -= j.getStyle("left").toInt();
      n.top -= j.getStyle("top").toInt();
      i -= n.left;
      l -= n.top;
      if (e.getStyle("position") != "relative") {
        i += g.left;
        l += g.top;
      }
      o += c.left - n.left;
      a += c.top - n.top;
      if (e != d) {
        i += k.left + m.left;
        l += (Browser.ie6 || Browser.ie7 ? 0 : k.top) + m.top;
      }
    } else {
      i -= c.left;
      l -= c.top;
      if (e != d) {
        i += h.left + g.left;
        l += h.top + g.top;
      }
    }
    return { x: [i, o], y: [l, a] };
  },
  getDroppableCoordinates: function (c) {
    var b = c.getCoordinates();
    if (c.getStyle("position") == "fixed") {
      var a = window.getScroll();
      b.left += a.x;
      b.right += a.x;
      b.top += a.y;
      b.bottom += a.y;
    }
    return b;
  },
  checkDroppables: function () {
    var a = this.droppables
      .filter(function (d, c) {
        d = this.positions
          ? this.positions[c]
          : this.getDroppableCoordinates(d);
        var b = this.mouse.now;
        return b.x > d.left && b.x < d.right && b.y < d.bottom && b.y > d.top;
      }, this)
      .getLast();
    if (this.overed != a) {
      if (this.overed) {
        this.fireEvent("leave", [this.element, this.overed]);
      }
      if (a) {
        this.fireEvent("enter", [this.element, a]);
      }
      this.overed = a;
    }
  },
  drag: function (a) {
    this.parent(a);
    if (this.options.checkDroppables && this.droppables.length) {
      this.checkDroppables();
    }
  },
  stop: function (a) {
    this.checkDroppables();
    this.fireEvent("drop", [this.element, this.overed, a]);
    this.overed = null;
    return this.parent(a);
  },
});
Element.implement({
  makeDraggable: function (a) {
    var b = new Drag.Move(this, a);
    this.store("dragger", b);
    return b;
  },
});
var Slider = new Class({
  Implements: [Events, Options],
  Binds: ["clickedElement", "draggedKnob", "scrolledElement"],
  options: {
    onTick: function (a) {
      this.setKnobPosition(a);
    },
    initialStep: 0,
    snap: false,
    offset: 0,
    range: false,
    wheel: false,
    steps: 100,
    mode: "horizontal",
  },
  initialize: function (f, a, e) {
    this.setOptions(e);
    e = this.options;
    this.element = document.id(f);
    a = this.knob = document.id(a);
    this.previousChange = this.previousEnd = this.step = -1;
    var b = {},
      d = { x: false, y: false };
    switch (e.mode) {
      case "vertical":
        this.axis = "y";
        this.property = "top";
        this.offset = "offsetHeight";
        break;
      case "horizontal":
        this.axis = "x";
        this.property = "left";
        this.offset = "offsetWidth";
    }
    this.setSliderDimensions();
    this.setRange(e.range);
    if (a.getStyle("position") == "static") {
      a.setStyle("position", "relative");
    }
    a.setStyle(this.property, -e.offset);
    d[this.axis] = this.property;
    b[this.axis] = [-e.offset, this.full - e.offset];
    var c = {
      snap: 0,
      limit: b,
      modifiers: d,
      onDrag: this.draggedKnob,
      onStart: this.draggedKnob,
      onBeforeStart: function () {
        this.isDragging = true;
      }.bind(this),
      onCancel: function () {
        this.isDragging = false;
      }.bind(this),
      onComplete: function () {
        this.isDragging = false;
        this.draggedKnob();
        this.end();
      }.bind(this),
    };
    if (e.snap) {
      this.setSnap(c);
    }
    this.drag = new Drag(a, c);
    this.attach();
    if (e.initialStep != null) {
      this.set(e.initialStep);
    }
  },
  attach: function () {
    this.element.addEvent("mousedown", this.clickedElement);
    if (this.options.wheel) {
      this.element.addEvent("mousewheel", this.scrolledElement);
    }
    this.drag.attach();
    return this;
  },
  detach: function () {
    this.element
      .removeEvent("mousedown", this.clickedElement)
      .removeEvent("mousewheel", this.scrolledElement);
    this.drag.detach();
    return this;
  },
  autosize: function () {
    this.setSliderDimensions().setKnobPosition(this.toPosition(this.step));
    this.drag.options.limit[this.axis] = [
      -this.options.offset,
      this.full - this.options.offset,
    ];
    if (this.options.snap) {
      this.setSnap();
    }
    return this;
  },
  setSnap: function (a) {
    if (!a) {
      a = this.drag.options;
    }
    a.grid = Math.ceil(this.stepWidth);
    a.limit[this.axis][1] = this.full;
    return this;
  },
  setKnobPosition: function (a) {
    if (this.options.snap) {
      a = this.toPosition(this.step);
    }
    this.knob.setStyle(this.property, a);
    return this;
  },
  setSliderDimensions: function () {
    this.full = this.element.measure(
      function () {
        this.half = this.knob[this.offset] / 2;
        return (
          this.element[this.offset] -
          this.knob[this.offset] +
          this.options.offset * 2
        );
      }.bind(this)
    );
    return this;
  },
  set: function (a) {
    if (!((this.range > 0) ^ (a < this.min))) {
      a = this.min;
    }
    if (!((this.range > 0) ^ (a > this.max))) {
      a = this.max;
    }
    this.step = Math.round(a);
    return this.checkStep().fireEvent("tick", this.toPosition(this.step)).end();
  },
  setRange: function (a, b) {
    this.min = Array.pick([a[0], 0]);
    this.max = Array.pick([a[1], this.options.steps]);
    this.range = this.max - this.min;
    this.steps = this.options.steps || this.full;
    this.stepSize = Math.abs(this.range) / this.steps;
    this.stepWidth = (this.stepSize * this.full) / Math.abs(this.range);
    if (a) {
      this.set(Array.pick([b, this.step]).floor(this.min).max(this.max));
    }
    return this;
  },
  clickedElement: function (c) {
    if (this.isDragging || c.target == this.knob) {
      return;
    }
    var b = this.range < 0 ? -1 : 1,
      a = c.page[this.axis] - this.element.getPosition()[this.axis] - this.half;
    a = a.limit(-this.options.offset, this.full - this.options.offset);
    this.step = Math.round(this.min + b * this.toStep(a));
    this.checkStep().fireEvent("tick", a).end();
  },
  scrolledElement: function (a) {
    var b = this.options.mode == "horizontal" ? a.wheel < 0 : a.wheel > 0;
    this.set(this.step + (b ? -1 : 1) * this.stepSize);
    a.stop();
  },
  draggedKnob: function () {
    var b = this.range < 0 ? -1 : 1,
      a = this.drag.value.now[this.axis];
    a = a.limit(-this.options.offset, this.full - this.options.offset);
    this.step = Math.round(this.min + b * this.toStep(a));
    this.checkStep();
  },
  checkStep: function () {
    var a = this.step;
    if (this.previousChange != a) {
      this.previousChange = a;
      this.fireEvent("change", a);
    }
    return this;
  },
  end: function () {
    var a = this.step;
    if (this.previousEnd !== a) {
      this.previousEnd = a;
      this.fireEvent("complete", a + "");
    }
    return this;
  },
  toStep: function (a) {
    var b =
      (((a + this.options.offset) * this.stepSize) / this.full) * this.steps;
    return this.options.steps ? Math.round((b -= b % this.stepSize)) : b;
  },
  toPosition: function (a) {
    return (
      (this.full * Math.abs(this.min - a)) / (this.steps * this.stepSize) -
      this.options.offset
    );
  },
});
var Sortables = new Class({
  Implements: [Events, Options],
  options: {
    opacity: 1,
    clone: false,
    revert: false,
    handle: false,
    dragOptions: {},
  },
  initialize: function (a, b) {
    this.setOptions(b);
    this.elements = [];
    this.lists = [];
    this.idle = true;
    this.addLists($$(document.id(a) || a));
    if (!this.options.clone) {
      this.options.revert = false;
    }
    if (this.options.revert) {
      this.effect = new Fx.Morph(
        null,
        Object.merge({ duration: 250, link: "cancel" }, this.options.revert)
      );
    }
  },
  attach: function () {
    this.addLists(this.lists);
    return this;
  },
  detach: function () {
    this.lists = this.removeLists(this.lists);
    return this;
  },
  addItems: function () {
    Array.flatten(arguments).each(function (a) {
      this.elements.push(a);
      var b = a.retrieve(
        "sortables:start",
        function (c) {
          this.start.call(this, c, a);
        }.bind(this)
      );
      (this.options.handle
        ? a.getElement(this.options.handle) || a
        : a
      ).addEvent("mousedown", b);
    }, this);
    return this;
  },
  addLists: function () {
    Array.flatten(arguments).each(function (a) {
      this.lists.include(a);
      this.addItems(a.getChildren());
    }, this);
    return this;
  },
  removeItems: function () {
    return $$(
      Array.flatten(arguments).map(function (a) {
        this.elements.erase(a);
        var b = a.retrieve("sortables:start");
        (this.options.handle
          ? a.getElement(this.options.handle) || a
          : a
        ).removeEvent("mousedown", b);
        return a;
      }, this)
    );
  },
  removeLists: function () {
    return $$(
      Array.flatten(arguments).map(function (a) {
        this.lists.erase(a);
        this.removeItems(a.getChildren());
        return a;
      }, this)
    );
  },
  getClone: function (b, a) {
    if (!this.options.clone) {
      return new Element(a.tagName).inject(document.body);
    }
    if (typeOf(this.options.clone) == "function") {
      return this.options.clone.call(this, b, a, this.list);
    }
    var c = a
      .clone(true)
      .setStyles({
        margin: 0,
        position: "absolute",
        visibility: "hidden",
        width: a.getStyle("width"),
      })
      .addEvent("mousedown", function (d) {
        a.fireEvent("mousedown", d);
      });
    if (c.get("html").test("radio")) {
      c.getElements("input[type=radio]").each(function (d, e) {
        d.set("name", "clone_" + e);
        if (d.get("checked")) {
          a.getElements("input[type=radio]")[e].set("checked", true);
        }
      });
    }
    return c.inject(this.list).setPosition(a.getPosition(a.getOffsetParent()));
  },
  getDroppables: function () {
    var a = this.list.getChildren().erase(this.clone).erase(this.element);
    if (!this.options.constrain) {
      a.append(this.lists).erase(this.list);
    }
    return a;
  },
  insert: function (c, b) {
    var a = "inside";
    if (this.lists.contains(b)) {
      this.list = b;
      this.drag.droppables = this.getDroppables();
    } else {
      a = this.element.getAllPrevious().contains(b) ? "before" : "after";
    }
    this.element.inject(b, a);
    this.fireEvent("sort", [this.element, this.clone]);
  },
  start: function (b, a) {
    if (
      !this.idle ||
      b.rightClick ||
      ["button", "input", "a", "textarea"].contains(b.target.get("tag"))
    ) {
      return;
    }
    this.idle = false;
    this.element = a;
    this.opacity = a.getStyle("opacity");
    this.list = a.getParent();
    this.clone = this.getClone(b, a);
    this.drag = new Drag.Move(
      this.clone,
      Object.merge(
        { droppables: this.getDroppables() },
        this.options.dragOptions
      )
    ).addEvents({
      onSnap: function () {
        b.stop();
        this.clone.setStyle("visibility", "visible");
        this.element.setStyle("opacity", this.options.opacity || 0);
        this.fireEvent("start", [this.element, this.clone]);
      }.bind(this),
      onEnter: this.insert.bind(this),
      onCancel: this.end.bind(this),
      onComplete: this.end.bind(this),
    });
    this.clone.inject(this.element, "before");
    this.drag.start(b);
  },
  end: function () {
    this.drag.detach();
    this.element.setStyle("opacity", this.opacity);
    if (this.effect) {
      var b = this.element.getStyles("width", "height"),
        d = this.clone,
        c = d.computePosition(
          this.element.getPosition(this.clone.getOffsetParent())
        );
      var a = function () {
        this.removeEvent("cancel", a);
        d.destroy();
      };
      this.effect.element = d;
      this.effect
        .start({
          top: c.top,
          left: c.left,
          width: b.width,
          height: b.height,
          opacity: 0.25,
        })
        .addEvent("cancel", a)
        .chain(a);
    } else {
      this.clone.destroy();
    }
    this.reset();
  },
  reset: function () {
    this.idle = true;
    this.fireEvent("complete", this.element);
  },
  serialize: function () {
    var c = Array.link(arguments, {
      modifier: Type.isFunction,
      index: function (d) {
        return d != null;
      },
    });
    var b = this.lists.map(function (d) {
      return d.getChildren().map(
        c.modifier ||
          function (e) {
            return e.get("id");
          },
        this
      );
    }, this);
    var a = c.index;
    if (this.lists.length == 1) {
      a = 0;
    }
    return (a || a === 0) && a >= 0 && a < this.lists.length ? b[a] : b;
  },
});
Request.JSONP = new Class({
  Implements: [Chain, Events, Options],
  options: {
    onRequest: function (a) {
      if (this.options.log && window.console && console.log) {
        console.log("JSONP retrieving script with url:" + a);
      }
    },
    onError: function (a) {
      if (this.options.log && window.console && console.warn) {
        console.warn(
          "JSONP " +
            a +
            " will fail in Internet Explorer, which enforces a 2083 bytes length limit on URIs"
        );
      }
    },
    url: "",
    callbackKey: "callback",
    injectScript: document.head,
    data: "",
    link: "ignore",
    timeout: 0,
    log: false,
  },
  initialize: function (a) {
    this.setOptions(a);
  },
  send: function (c) {
    if (!Request.prototype.check.call(this, c)) {
      return this;
    }
    this.running = true;
    var d = typeOf(c);
    if (d == "string" || d == "element") {
      c = { data: c };
    }
    c = Object.merge(this.options, c || {});
    var e = c.data;
    switch (typeOf(e)) {
      case "element":
        e = document.id(e).toQueryString();
        break;
      case "object":
      case "hash":
        e = Object.toQueryString(e);
    }
    var b = (this.index = Request.JSONP.counter++);
    var f =
      c.url +
      (c.url.test("\\?") ? "&" : "?") +
      c.callbackKey +
      "=Request.JSONP.request_map.request_" +
      b +
      (e ? "&" + e : "");
    if (f.length > 2083) {
      this.fireEvent("error", f);
    }
    Request.JSONP.request_map["request_" + b] = function () {
      this.success(arguments, b);
    }.bind(this);
    var a = this.getScript(f).inject(c.injectScript);
    this.fireEvent("request", [f, a]);
    if (c.timeout) {
      this.timeout.delay(c.timeout, this);
    }
    return this;
  },
  getScript: function (a) {
    if (!this.script) {
      this.script = new Element("script", {
        type: "text/javascript",
        async: true,
        src: a,
      });
    }
    return this.script;
  },
  success: function (b, a) {
    if (!this.running) {
      return;
    }
    this.clear().fireEvent("complete", b).fireEvent("success", b).callChain();
  },
  cancel: function () {
    if (this.running) {
      this.clear().fireEvent("cancel");
    }
    return this;
  },
  isRunning: function () {
    return !!this.running;
  },
  clear: function () {
    this.running = false;
    if (this.script) {
      this.script.destroy();
      this.script = null;
    }
    return this;
  },
  timeout: function () {
    if (this.running) {
      this.running = false;
      this.fireEvent("timeout", [this.script.get("src"), this.script])
        .fireEvent("failure")
        .cancel();
    }
    return this;
  },
});
Request.JSONP.counter = 0;
Request.JSONP.request_map = {};
Request.Queue = new Class({
  Implements: [Options, Events],
  Binds: [
    "attach",
    "request",
    "complete",
    "cancel",
    "success",
    "failure",
    "exception",
  ],
  options: {
    stopOnFailure: true,
    autoAdvance: true,
    concurrent: 1,
    requests: {},
  },
  initialize: function (a) {
    var b;
    if (a) {
      b = a.requests;
      delete a.requests;
    }
    this.setOptions(a);
    this.requests = {};
    this.queue = [];
    this.reqBinders = {};
    if (b) {
      this.addRequests(b);
    }
  },
  addRequest: function (a, b) {
    this.requests[a] = b;
    this.attach(a, b);
    return this;
  },
  addRequests: function (a) {
    Object.each(
      a,
      function (c, b) {
        this.addRequest(b, c);
      },
      this
    );
    return this;
  },
  getName: function (a) {
    return Object.keyOf(this.requests, a);
  },
  attach: function (a, b) {
    if (b._groupSend) {
      return this;
    }
    ["request", "complete", "cancel", "success", "failure", "exception"].each(
      function (c) {
        if (!this.reqBinders[a]) {
          this.reqBinders[a] = {};
        }
        this.reqBinders[a][c] = function () {
          this["on" + c.capitalize()].apply(this, [a, b].append(arguments));
        }.bind(this);
        b.addEvent(c, this.reqBinders[a][c]);
      },
      this
    );
    b._groupSend = b.send;
    b.send = function (c) {
      this.send(a, c);
      return b;
    }.bind(this);
    return this;
  },
  removeRequest: function (b) {
    var a = typeOf(b) == "object" ? this.getName(b) : b;
    if (!a && typeOf(a) != "string") {
      return this;
    }
    b = this.requests[a];
    if (!b) {
      return this;
    }
    ["request", "complete", "cancel", "success", "failure", "exception"].each(
      function (c) {
        b.removeEvent(c, this.reqBinders[a][c]);
      },
      this
    );
    b.send = b._groupSend;
    delete b._groupSend;
    return this;
  },
  getRunning: function () {
    return Object.filter(this.requests, function (a) {
      return a.running;
    });
  },
  isRunning: function () {
    return !!Object.keys(this.getRunning()).length;
  },
  send: function (b, a) {
    var c = function () {
      this.requests[b]._groupSend(a);
      this.queue.erase(c);
    }.bind(this);
    c.name = b;
    if (
      Object.keys(this.getRunning()).length >= this.options.concurrent ||
      (this.error && this.options.stopOnFailure)
    ) {
      this.queue.push(c);
    } else {
      c();
    }
    return this;
  },
  hasNext: function (a) {
    return !a
      ? !!this.queue.length
      : !!this.queue.filter(function (b) {
          return b.name == a;
        }).length;
  },
  resume: function () {
    this.error = false;
    (this.options.concurrent - Object.keys(this.getRunning()).length).times(
      this.runNext,
      this
    );
    return this;
  },
  runNext: function (a) {
    if (!this.queue.length) {
      return this;
    }
    if (!a) {
      this.queue[0]();
    } else {
      var b;
      this.queue.each(function (c) {
        if (!b && c.name == a) {
          b = true;
          c();
        }
      });
    }
    return this;
  },
  runAll: function () {
    this.queue.each(function (a) {
      a();
    });
    return this;
  },
  clear: function (a) {
    if (!a) {
      this.queue.empty();
    } else {
      this.queue = this.queue
        .map(function (b) {
          if (b.name != a) {
            return b;
          } else {
            return false;
          }
        })
        .filter(function (b) {
          return b;
        });
    }
    return this;
  },
  cancel: function (a) {
    this.requests[a].cancel();
    return this;
  },
  onRequest: function () {
    this.fireEvent("request", arguments);
  },
  onComplete: function () {
    this.fireEvent("complete", arguments);
    if (!this.queue.length) {
      this.fireEvent("end");
    }
  },
  onCancel: function () {
    if (this.options.autoAdvance && !this.error) {
      this.runNext();
    }
    this.fireEvent("cancel", arguments);
  },
  onSuccess: function () {
    if (this.options.autoAdvance && !this.error) {
      this.runNext();
    }
    this.fireEvent("success", arguments);
  },
  onFailure: function () {
    this.error = true;
    if (!this.options.stopOnFailure && this.options.autoAdvance) {
      this.runNext();
    }
    this.fireEvent("failure", arguments);
  },
  onException: function () {
    this.error = true;
    if (!this.options.stopOnFailure && this.options.autoAdvance) {
      this.runNext();
    }
    this.fireEvent("exception", arguments);
  },
});
Request.implement({
  options: { initialDelay: 5000, delay: 5000, limit: 60000 },
  startTimer: function (b) {
    var a = function () {
      if (!this.running) {
        this.send({ data: b });
      }
    };
    this.lastDelay = this.options.initialDelay;
    this.timer = a.delay(this.lastDelay, this);
    this.completeCheck = function (c) {
      clearTimeout(this.timer);
      this.lastDelay = c
        ? this.options.delay
        : (this.lastDelay + this.options.delay).min(this.options.limit);
      this.timer = a.delay(this.lastDelay, this);
    };
    return this.addEvent("complete", this.completeCheck);
  },
  stopTimer: function () {
    clearTimeout(this.timer);
    return this.removeEvent("complete", this.completeCheck);
  },
});
var Asset = {
  javascript: function (d, b) {
    if (!b) {
      b = {};
    }
    var a = new Element("script", { src: d, type: "text/javascript" }),
      e = b.document || document,
      c = b.onload || b.onLoad;
    delete b.onload;
    delete b.onLoad;
    delete b.document;
    if (c) {
      if (typeof a.onreadystatechange != "undefined") {
        a.addEvent("readystatechange", function () {
          if (["loaded", "complete"].contains(this.readyState)) {
            c.call(this);
          }
        });
      } else {
        a.addEvent("load", c);
      }
    }
    return a.set(b).inject(e.head);
  },
  css: function (d, a) {
    if (!a) {
      a = {};
    }
    var b = new Element("link", {
      rel: "stylesheet",
      media: "screen",
      type: "text/css",
      href: d,
    });
    var c = a.onload || a.onLoad,
      e = a.document || document;
    delete a.onload;
    delete a.onLoad;
    delete a.document;
    if (c) {
      b.addEvent("load", c);
    }
    return b.set(a).inject(e.head);
  },
  image: function (c, b) {
    if (!b) {
      b = {};
    }
    var d = new Image(),
      a = document.id(d) || new Element("img");
    ["load", "abort", "error"].each(function (e) {
      var g = "on" + e,
        f = "on" + e.capitalize(),
        h = b[g] || b[f] || function () {};
      delete b[f];
      delete b[g];
      d[g] = function () {
        if (!d) {
          return;
        }
        if (!a.parentNode) {
          a.width = d.width;
          a.height = d.height;
        }
        d = d.onload = d.onabort = d.onerror = null;
        h.delay(1, a, a);
        a.fireEvent(e, a, 1);
      };
    });
    d.src = a.src = c;
    if (d && d.complete) {
      d.onload.delay(1);
    }
    return a.set(b);
  },
  images: function (c, b) {
    c = Array.from(c);
    var d = function () {},
      a = 0;
    b = Object.merge(
      { onComplete: d, onProgress: d, onError: d, properties: {} },
      b
    );
    return new Elements(
      c.map(function (f, e) {
        return Asset.image(
          f,
          Object.append(b.properties, {
            onload: function () {
              a++;
              b.onProgress.call(this, a, e, f);
              if (a == c.length) {
                b.onComplete();
              }
            },
            onerror: function () {
              a++;
              b.onError.call(this, a, e, f);
              if (a == c.length) {
                b.onComplete();
              }
            },
          })
        );
      })
    );
  },
};
(function () {
  var a = (this.Color = new Type("Color", function (c, d) {
    if (arguments.length >= 3) {
      d = "rgb";
      c = Array.slice(arguments, 0, 3);
    } else {
      if (typeof c == "string") {
        if (c.match(/rgb/)) {
          c = c.rgbToHex().hexToRgb(true);
        } else {
          if (c.match(/hsb/)) {
            c = c.hsbToRgb();
          } else {
            c = c.hexToRgb(true);
          }
        }
      }
    }
    d = d || "rgb";
    switch (d) {
      case "hsb":
        var b = c;
        c = c.hsbToRgb();
        c.hsb = b;
        break;
      case "hex":
        c = c.hexToRgb(true);
        break;
    }
    c.rgb = c.slice(0, 3);
    c.hsb = c.hsb || c.rgbToHsb();
    c.hex = c.rgbToHex();
    return Object.append(c, this);
  }));
  a.implement({
    mix: function () {
      var b = Array.slice(arguments);
      var d = typeOf(b.getLast()) == "number" ? b.pop() : 50;
      var c = this.slice();
      b.each(function (e) {
        e = new a(e);
        for (var f = 0; f < 3; f++) {
          c[f] = Math.round((c[f] / 100) * (100 - d) + (e[f] / 100) * d);
        }
      });
      return new a(c, "rgb");
    },
    invert: function () {
      return new a(
        this.map(function (b) {
          return 255 - b;
        })
      );
    },
    setHue: function (b) {
      return new a([b, this.hsb[1], this.hsb[2]], "hsb");
    },
    setSaturation: function (b) {
      return new a([this.hsb[0], b, this.hsb[2]], "hsb");
    },
    setBrightness: function (b) {
      return new a([this.hsb[0], this.hsb[1], b], "hsb");
    },
  });
  this.$RGB = function (e, d, c) {
    return new a([e, d, c], "rgb");
  };
  this.$HSB = function (e, d, c) {
    return new a([e, d, c], "hsb");
  };
  this.$HEX = function (b) {
    return new a(b, "hex");
  };
  Array.implement({
    rgbToHsb: function () {
      var c = this[0],
        d = this[1],
        k = this[2],
        h = 0;
      var j = Math.max(c, d, k),
        f = Math.min(c, d, k);
      var l = j - f;
      var i = j / 255,
        g = j != 0 ? l / j : 0;
      if (g != 0) {
        var e = (j - c) / l;
        var b = (j - d) / l;
        var m = (j - k) / l;
        if (c == j) {
          h = m - b;
        } else {
          if (d == j) {
            h = 2 + e - m;
          } else {
            h = 4 + b - e;
          }
        }
        h /= 6;
        if (h < 0) {
          h++;
        }
      }
      return [Math.round(h * 360), Math.round(g * 100), Math.round(i * 100)];
    },
    hsbToRgb: function () {
      var d = Math.round((this[2] / 100) * 255);
      if (this[1] == 0) {
        return [d, d, d];
      } else {
        var b = this[0] % 360;
        var g = b % 60;
        var h = Math.round(((this[2] * (100 - this[1])) / 10000) * 255);
        var e = Math.round(((this[2] * (6000 - this[1] * g)) / 600000) * 255);
        var c = Math.round(
          ((this[2] * (6000 - this[1] * (60 - g))) / 600000) * 255
        );
        switch (Math.floor(b / 60)) {
          case 0:
            return [d, c, h];
          case 1:
            return [e, d, h];
          case 2:
            return [h, d, c];
          case 3:
            return [h, e, d];
          case 4:
            return [c, h, d];
          case 5:
            return [d, h, e];
        }
      }
      return false;
    },
  });
  String.implement({
    rgbToHsb: function () {
      var b = this.match(/\d{1,3}/g);
      return b ? b.rgbToHsb() : null;
    },
    hsbToRgb: function () {
      var b = this.match(/\d{1,3}/g);
      return b ? b.hsbToRgb() : null;
    },
  });
})();
(function () {
  this.Group = new Class({
    initialize: function () {
      this.instances = Array.flatten(arguments);
    },
    addEvent: function (e, d) {
      var g = this.instances,
        a = g.length,
        f = a,
        c = new Array(a),
        b = this;
      g.each(function (h, j) {
        h.addEvent(e, function () {
          if (!c[j]) {
            f--;
          }
          c[j] = arguments;
          if (!f) {
            d.call(b, g, h, c);
            f = a;
            c = new Array(a);
          }
        });
      });
    },
  });
})();
Hash.Cookie = new Class({
  Extends: Cookie,
  options: { autoSave: true },
  initialize: function (b, a) {
    this.parent(b, a);
    this.load();
  },
  save: function () {
    var a = JSON.encode(this.hash);
    if (!a || a.length > 4096) {
      return false;
    }
    if (a == "{}") {
      this.dispose();
    } else {
      this.write(a);
    }
    return true;
  },
  load: function () {
    this.hash = new Hash(JSON.decode(this.read(), true));
    return this;
  },
});
Hash.each(Hash.prototype, function (b, a) {
  if (typeof b == "function") {
    Hash.Cookie.implement(a, function () {
      var c = b.apply(this.hash, arguments);
      if (this.options.autoSave) {
        this.save();
      }
      return c;
    });
  }
});
(function () {
  var a = (this.Table = function () {
    this.length = 0;
    var c = [],
      b = [];
    this.set = function (e, g) {
      var d = c.indexOf(e);
      if (d == -1) {
        var f = c.length;
        c[f] = e;
        b[f] = g;
        this.length++;
      } else {
        b[d] = g;
      }
      return this;
    };
    this.get = function (e) {
      var d = c.indexOf(e);
      return d == -1 ? null : b[d];
    };
    this.erase = function (e) {
      var d = c.indexOf(e);
      if (d != -1) {
        this.length--;
        c.splice(d, 1);
        return b.splice(d, 1)[0];
      }
      return null;
    };
    this.each = this.forEach = function (f, g) {
      for (var e = 0, d = this.length; e < d; e++) {
        f.call(g, c[e], b[e], this);
      }
    };
  });
  if (this.Type) {
    new Type("Table", a);
  }
})();
var HtmlTable = new Class({
  Implements: [Options, Events, Class.Occlude],
  options: {
    properties: { cellpadding: 0, cellspacing: 0, border: 0 },
    rows: [],
    headers: [],
    footers: [],
  },
  property: "HtmlTable",
  initialize: function () {
    var a = Array.link(arguments, {
      options: Type.isObject,
      table: Type.isElement,
      id: Type.isString,
    });
    this.setOptions(a.options);
    if (!a.table && a.id) {
      a.table = document.id(a.id);
    }
    this.element = a.table || new Element("table", this.options.properties);
    if (this.occlude()) {
      return this.occluded;
    }
    this.build();
  },
  build: function () {
    this.element.store("HtmlTable", this);
    this.body =
      document.id(this.element.tBodies[0]) ||
      new Element("tbody").inject(this.element);
    $$(this.body.rows);
    if (this.options.headers.length) {
      this.setHeaders(this.options.headers);
    } else {
      this.thead = document.id(this.element.tHead);
    }
    if (this.thead) {
      this.head = this.getHead();
    }
    if (this.options.footers.length) {
      this.setFooters(this.options.footers);
    }
    this.tfoot = document.id(this.element.tFoot);
    if (this.tfoot) {
      this.foot = document.id(this.tfoot.rows[0]);
    }
    this.options.rows.each(function (a) {
      this.push(a);
    }, this);
  },
  toElement: function () {
    return this.element;
  },
  empty: function () {
    this.body.empty();
    return this;
  },
  set: function (e, a) {
    var d = e == "headers" ? "tHead" : "tFoot",
      b = d.toLowerCase();
    this[b] = (
      document.id(this.element[d]) || new Element(b).inject(this.element, "top")
    ).empty();
    var c = this.push(a, {}, this[b], e == "headers" ? "th" : "td");
    if (e == "headers") {
      this.head = this.getHead();
    } else {
      this.foot = this.getHead();
    }
    return c;
  },
  getHead: function () {
    var a = this.thead.rows;
    return a.length > 1 ? $$(a) : a.length ? document.id(a[0]) : false;
  },
  setHeaders: function (a) {
    this.set("headers", a);
    return this;
  },
  setFooters: function (a) {
    this.set("footers", a);
    return this;
  },
  update: function (d, e, a) {
    var b = d.getChildren(a || "td"),
      c = b.length - 1;
    e.each(function (i, f) {
      var j = b[f] || new Element(a || "td").inject(d),
        h = (i ? i.content : "") || i,
        g = typeOf(h);
      if (i && i.properties) {
        j.set(i.properties);
      }
      if (/(element(s?)|array|collection)/.test(g)) {
        j.empty().adopt(h);
      } else {
        j.set("html", h);
      }
      if (f > c) {
        b.push(j);
      } else {
        b[f] = j;
      }
    });
    return { tr: d, tds: b };
  },
  push: function (e, c, d, a, b) {
    if (typeOf(e) == "element" && e.get("tag") == "tr") {
      e.inject(d || this.body, b);
      return { tr: e, tds: e.getChildren("td") };
    }
    return this.update(new Element("tr", c).inject(d || this.body, b), e, a);
  },
  pushMany: function (d, c, e, a, b) {
    return d.map(function (f) {
      return this.push(f, c, e, a, b);
    }, this);
  },
});
["adopt", "inject", "wraps", "grab", "replaces", "dispose"].each(function (a) {
  HtmlTable.implement(a, function () {
    this.element[a].apply(this.element, arguments);
    return this;
  });
});
HtmlTable = Class.refactor(HtmlTable, {
  options: {
    classZebra: "table-tr-odd",
    zebra: true,
    zebraOnlyVisibleRows: true,
  },
  initialize: function () {
    this.previous.apply(this, arguments);
    if (this.occluded) {
      return this.occluded;
    }
    if (this.options.zebra) {
      this.updateZebras();
    }
  },
  updateZebras: function () {
    var a = 0;
    Array.each(
      this.body.rows,
      function (b) {
        if (!this.options.zebraOnlyVisibleRows || b.isDisplayed()) {
          this.zebra(b, a++);
        }
      },
      this
    );
  },
  setRowStyle: function (b, a) {
    if (this.previous) {
      this.previous(b, a);
    }
    this.zebra(b, a);
  },
  zebra: function (b, a) {
    return b[(a % 2 ? "remove" : "add") + "Class"](this.options.classZebra);
  },
  push: function () {
    var a = this.previous.apply(this, arguments);
    if (this.options.zebra) {
      this.updateZebras();
    }
    return a;
  },
});
HtmlTable = Class.refactor(HtmlTable, {
  options: {
    sortIndex: 0,
    sortReverse: false,
    parsers: [],
    defaultParser: "string",
    classSortable: "table-sortable",
    classHeadSort: "table-th-sort",
    classHeadSortRev: "table-th-sort-rev",
    classNoSort: "table-th-nosort",
    classGroupHead: "table-tr-group-head",
    classGroup: "table-tr-group",
    classCellSort: "table-td-sort",
    classSortSpan: "table-th-sort-span",
    sortable: false,
    thSelector: "th",
  },
  initialize: function () {
    this.previous.apply(this, arguments);
    if (this.occluded) {
      return this.occluded;
    }
    this.sorted = { index: null, dir: 1 };
    if (!this.bound) {
      this.bound = {};
    }
    this.bound.headClick = this.headClick.bind(this);
    this.sortSpans = new Elements();
    if (this.options.sortable) {
      this.enableSort();
      if (this.options.sortIndex != null) {
        this.sort(this.options.sortIndex, this.options.sortReverse);
      }
    }
  },
  attachSorts: function (a) {
    this.detachSorts();
    if (a !== false) {
      this.element.addEvent(
        "click:relay(" + this.options.thSelector + ")",
        this.bound.headClick
      );
    }
  },
  detachSorts: function () {
    this.element.removeEvents("click:relay(" + this.options.thSelector + ")");
  },
  setHeaders: function () {
    this.previous.apply(this, arguments);
    if (this.sortEnabled) {
      this.setParsers();
    }
  },
  setParsers: function () {
    this.parsers = this.detectParsers();
  },
  detectParsers: function () {
    return (
      this.head &&
      this.head
        .getElements(this.options.thSelector)
        .flatten()
        .map(this.detectParser, this)
    );
  },
  detectParser: function (a, b) {
    if (
      a.hasClass(this.options.classNoSort) ||
      a.retrieve("htmltable-parser")
    ) {
      return a.retrieve("htmltable-parser");
    }
    var c = new Element("div");
    c.adopt(a.childNodes).inject(a);
    var f = new Element("span", { class: this.options.classSortSpan }).inject(
      c,
      "top"
    );
    this.sortSpans.push(f);
    var g = this.options.parsers[b],
      e = this.body.rows,
      d;
    switch (typeOf(g)) {
      case "function":
        g = { convert: g };
        d = true;
        break;
      case "string":
        g = g;
        d = true;
        break;
    }
    if (!d) {
      HtmlTable.ParserPriority.some(function (k) {
        var o = HtmlTable.Parsers[k],
          m = o.match;
        if (!m) {
          return false;
        }
        for (var n = 0, l = e.length; n < l; n++) {
          var h = document.id(e[n].cells[b]),
            p = h ? h.get("html").clean() : "";
          if (p && m.test(p)) {
            g = o;
            return true;
          }
        }
      });
    }
    if (!g) {
      g = this.options.defaultParser;
    }
    a.store("htmltable-parser", g);
    return g;
  },
  headClick: function (b, a) {
    if (!this.head || a.hasClass(this.options.classNoSort)) {
      return;
    }
    return this.sort(
      Array.indexOf(
        this.head.getElements(this.options.thSelector).flatten(),
        a
      ) % this.body.rows[0].cells.length
    );
  },
  serialize: function () {
    var a = this.previous.apply(this, arguments) || {};
    if (this.options.sortable) {
      a.sortIndex = this.sorted.index;
      a.sortReverse = this.sorted.reverse;
    }
    return a;
  },
  restore: function (a) {
    if (this.options.sortable && a.sortIndex) {
      this.sort(a.sortIndex, a.sortReverse);
    }
    this.previous.apply(this, arguments);
  },
  setSortedState: function (b, a) {
    if (a != null) {
      this.sorted.reverse = a;
    } else {
      if (this.sorted.index == b) {
        this.sorted.reverse = !this.sorted.reverse;
      } else {
        this.sorted.reverse = this.sorted.index == null;
      }
    }
    if (b != null) {
      this.sorted.index = b;
    }
  },
  setHeadSort: function (a) {
    var b = $$(
      !this.head.length
        ? this.head.cells[this.sorted.index]
        : this.head
            .map(function (c) {
              return c.getElements(this.options.thSelector)[this.sorted.index];
            }, this)
            .clean()
    );
    if (!b.length) {
      return;
    }
    if (a) {
      b.addClass(this.options.classHeadSort);
      if (this.sorted.reverse) {
        b.addClass(this.options.classHeadSortRev);
      } else {
        b.removeClass(this.options.classHeadSortRev);
      }
    } else {
      b.removeClass(this.options.classHeadSort).removeClass(
        this.options.classHeadSortRev
      );
    }
  },
  setRowSort: function (b, a) {
    var e = b.length,
      d = this.body,
      g,
      f;
    while (e) {
      var h = b[--e],
        c = h.position,
        i = d.rows[c];
      if (i.disabled) {
        continue;
      }
      if (!a) {
        g = this.setGroupSort(g, i, h);
        this.setRowStyle(i, e);
      }
      d.appendChild(i);
      for (f = 0; f < e; f++) {
        if (b[f].position > c) {
          b[f].position--;
        }
      }
    }
  },
  setRowStyle: function (b, a) {
    this.previous(b, a);
    b.cells[this.sorted.index].addClass(this.options.classCellSort);
  },
  setGroupSort: function (b, c, a) {
    if (b == a.value) {
      c.removeClass(this.options.classGroupHead).addClass(
        this.options.classGroup
      );
    } else {
      c.removeClass(this.options.classGroup).addClass(
        this.options.classGroupHead
      );
    }
    return a.value;
  },
  getParser: function () {
    var a = this.parsers[this.sorted.index];
    return typeOf(a) == "string" ? HtmlTable.Parsers[a] : a;
  },
  sort: function (c, b, e) {
    if (!this.head) {
      return;
    }
    if (!e) {
      this.clearSort();
      this.setSortedState(c, b);
      this.setHeadSort(true);
    }
    var f = this.getParser();
    if (!f) {
      return;
    }
    var a;
    if (!Browser.ie) {
      a = this.body.getParent();
      this.body.dispose();
    }
    var d = this.parseData(f).sort(function (h, g) {
      if (h.value === g.value) {
        return 0;
      }
      return h.value > g.value ? 1 : -1;
    });
    if (this.sorted.reverse == (f == HtmlTable.Parsers["input-checked"])) {
      d.reverse(true);
    }
    this.setRowSort(d, e);
    if (a) {
      a.grab(this.body);
    }
    this.fireEvent("stateChanged");
    return this.fireEvent("sort", [this.body, this.sorted.index]);
  },
  parseData: function (a) {
    return Array.map(
      this.body.rows,
      function (d, b) {
        var c = a.convert.call(document.id(d.cells[this.sorted.index]));
        return { position: b, value: c };
      },
      this
    );
  },
  clearSort: function () {
    this.setHeadSort(false);
    this.body.getElements("td").removeClass(this.options.classCellSort);
  },
  reSort: function () {
    if (this.sortEnabled) {
      this.sort.call(this, this.sorted.index, this.sorted.reverse);
    }
    return this;
  },
  enableSort: function () {
    this.element.addClass(this.options.classSortable);
    this.attachSorts(true);
    this.setParsers();
    this.sortEnabled = true;
    return this;
  },
  disableSort: function () {
    this.element.removeClass(this.options.classSortable);
    this.attachSorts(false);
    this.sortSpans.each(function (a) {
      a.destroy();
    });
    this.sortSpans.empty();
    this.sortEnabled = false;
    return this;
  },
});
HtmlTable.ParserPriority = [
  "date",
  "input-checked",
  "input-value",
  "float",
  "number",
];
HtmlTable.Parsers = {
  date: {
    match: /^\d{2}[-\/ ]\d{2}[-\/ ]\d{2,4}$/,
    convert: function () {
      var a = Date.parse(this.get("text").stripTags());
      return typeOf(a) == "date" ? a.format("db") : "";
    },
    type: "date",
  },
  "input-checked": {
    match: / type="(radio|checkbox)" /,
    convert: function () {
      return this.getElement("input").checked;
    },
  },
  "input-value": {
    match: /<input/,
    convert: function () {
      return this.getElement("input").value;
    },
  },
  number: {
    match: /^\d+[^\d.,]*$/,
    convert: function () {
      return this.get("text").stripTags().toInt();
    },
    number: true,
  },
  numberLax: {
    match: /^[^\d]+\d+$/,
    convert: function () {
      return this.get("text")
        .replace(/[^-?^0-9]/, "")
        .stripTags()
        .toInt();
    },
    number: true,
  },
  float: {
    match: /^[\d]+\.[\d]+/,
    convert: function () {
      return this.get("text")
        .replace(/[^-?^\d.]/, "")
        .stripTags()
        .toFloat();
    },
    number: true,
  },
  floatLax: {
    match: /^[^\d]+[\d]+\.[\d]+$/,
    convert: function () {
      return this.get("text")
        .replace(/[^-?^\d.]/, "")
        .stripTags();
    },
    number: true,
  },
  string: {
    match: null,
    convert: function () {
      return this.get("text").stripTags().toLowerCase();
    },
  },
  title: {
    match: null,
    convert: function () {
      return this.title;
    },
  },
};
HtmlTable.defineParsers = function (a) {
  HtmlTable.Parsers = Object.append(HtmlTable.Parsers, a);
  for (var b in a) {
    HtmlTable.ParserPriority.unshift(b);
  }
};
(function () {
  var a = (this.Keyboard = new Class({
    Extends: Events,
    Implements: [Options],
    options: {
      defaultEventType: "keydown",
      active: false,
      manager: null,
      events: {},
      nonParsedEvents: [
        "activate",
        "deactivate",
        "onactivate",
        "ondeactivate",
        "changed",
        "onchanged",
      ],
    },
    initialize: function (f) {
      if (f && f.manager) {
        this._manager = f.manager;
        delete f.manager;
      }
      this.setOptions(f);
      this._setup();
    },
    addEvent: function (h, g, f) {
      return this.parent(
        a.parse(h, this.options.defaultEventType, this.options.nonParsedEvents),
        g,
        f
      );
    },
    removeEvent: function (g, f) {
      return this.parent(
        a.parse(g, this.options.defaultEventType, this.options.nonParsedEvents),
        f
      );
    },
    toggleActive: function () {
      return this[this.isActive() ? "deactivate" : "activate"]();
    },
    activate: function (f) {
      if (f) {
        if (f.isActive()) {
          return this;
        }
        if (this._activeKB && f != this._activeKB) {
          this.previous = this._activeKB;
          this.previous.fireEvent("deactivate");
        }
        this._activeKB = f.fireEvent("activate");
        a.manager.fireEvent("changed");
      } else {
        if (this._manager) {
          this._manager.activate(this);
        }
      }
      return this;
    },
    isActive: function () {
      return this._manager
        ? this._manager._activeKB == this
        : a.manager == this;
    },
    deactivate: function (f) {
      if (f) {
        if (f === this._activeKB) {
          this._activeKB = null;
          f.fireEvent("deactivate");
          a.manager.fireEvent("changed");
        }
      } else {
        if (this._manager) {
          this._manager.deactivate(this);
        }
      }
      return this;
    },
    relinquish: function () {
      if (this.isActive() && this._manager && this._manager.previous) {
        this._manager.activate(this._manager.previous);
      } else {
        this.deactivate();
      }
      return this;
    },
    manage: function (f) {
      if (f._manager) {
        f._manager.drop(f);
      }
      this._instances.push(f);
      f._manager = this;
      if (!this._activeKB) {
        this.activate(f);
      }
      return this;
    },
    drop: function (f) {
      f.relinquish();
      this._instances.erase(f);
      if (this._activeKB == f) {
        if (this.previous && this._instances.contains(this.previous)) {
          this.activate(this.previous);
        } else {
          this._activeKB = this._instances[0];
        }
      }
      return this;
    },
    trace: function () {
      a.trace(this);
    },
    each: function (f) {
      a.each(this, f);
    },
    _instances: [],
    _disable: function (f) {
      if (this._activeKB == f) {
        this._activeKB = null;
      }
    },
    _setup: function () {
      this.addEvents(this.options.events);
      if (a.manager && !this._manager) {
        a.manager.manage(this);
      }
      if (this.options.active) {
        this.activate();
      } else {
        this.relinquish();
      }
    },
    _handle: function (h, g) {
      if (h.preventKeyboardPropagation) {
        return;
      }
      var f = !!this._manager;
      if (f && this._activeKB) {
        this._activeKB._handle(h, g);
        if (h.preventKeyboardPropagation) {
          return;
        }
      }
      this.fireEvent(g, h);
      if (!f && this._activeKB) {
        this._activeKB._handle(h, g);
      }
    },
  }));
  var b = {};
  var c = ["shift", "control", "alt", "meta"];
  var e = /^(?:shift|control|ctrl|alt|meta)$/;
  a.parse = function (h, g, k) {
    if (k && k.contains(h.toLowerCase())) {
      return h;
    }
    h = h.toLowerCase().replace(/^(keyup|keydown):/, function (m, l) {
      g = l;
      return "";
    });
    if (!b[h]) {
      var f,
        j = {};
      h.split("+").each(function (l) {
        if (e.test(l)) {
          j[l] = true;
        } else {
          f = l;
        }
      });
      j.control = j.control || j.ctrl;
      var i = [];
      c.each(function (l) {
        if (j[l]) {
          i.push(l);
        }
      });
      if (f) {
        i.push(f);
      }
      b[h] = i.join("+");
    }
    return g + ":keys(" + b[h] + ")";
  };
  a.each = function (f, g) {
    var h = f || a.manager;
    while (h) {
      g.run(h);
      h = h._activeKB;
    }
  };
  a.stop = function (f) {
    f.preventKeyboardPropagation = true;
  };
  a.manager = new a({ active: true });
  a.trace = function (f) {
    f = f || a.manager;
    var g = window.console && console.log;
    if (g) {
      console.log("the following items have focus: ");
    }
    a.each(f, function (h) {
      if (g) {
        console.log(document.id(h.widget) || h.wiget || h);
      }
    });
  };
  var d = function (g) {
    var f = [];
    c.each(function (h) {
      if (g[h]) {
        f.push(h);
      }
    });
    if (!e.test(g.key)) {
      f.push(g.key);
    }
    a.manager._handle(g, g.type + ":keys(" + f.join("+") + ")");
  };
  document.addEvents({ keyup: d, keydown: d });
})();
Keyboard.prototype.options.nonParsedEvents.combine(["rebound", "onrebound"]);
Keyboard.implement({
  addShortcut: function (b, a) {
    this._shortcuts = this._shortcuts || [];
    this._shortcutIndex = this._shortcutIndex || {};
    a.getKeyboard = Function.from(this);
    a.name = b;
    this._shortcutIndex[b] = a;
    this._shortcuts.push(a);
    if (a.keys) {
      this.addEvent(a.keys, a.handler);
    }
    return this;
  },
  addShortcuts: function (b) {
    for (var a in b) {
      this.addShortcut(a, b[a]);
    }
    return this;
  },
  removeShortcut: function (b) {
    var a = this.getShortcut(b);
    if (a && a.keys) {
      this.removeEvent(a.keys, a.handler);
      delete this._shortcutIndex[b];
      this._shortcuts.erase(a);
    }
    return this;
  },
  removeShortcuts: function (a) {
    a.each(this.removeShortcut, this);
    return this;
  },
  getShortcuts: function () {
    return this._shortcuts || [];
  },
  getShortcut: function (a) {
    return (this._shortcutIndex || {})[a];
  },
});
Keyboard.rebind = function (b, a) {
  Array.from(a).each(function (c) {
    c.getKeyboard().removeEvent(c.keys, c.handler);
    c.getKeyboard().addEvent(b, c.handler);
    c.keys = b;
    c.getKeyboard().fireEvent("rebound");
  });
};
Keyboard.getActiveShortcuts = function (b) {
  var a = [],
    c = [];
  Keyboard.each(b, [].push.bind(a));
  a.each(function (d) {
    c.extend(d.getShortcuts());
  });
  return c;
};
Keyboard.getShortcut = function (c, b, d) {
  d = d || {};
  var a = d.many ? [] : null,
    e = d.many
      ? function (g) {
          var f = g.getShortcut(c);
          if (f) {
            a.push(f);
          }
        }
      : function (f) {
          if (!a) {
            a = f.getShortcut(c);
          }
        };
  Keyboard.each(b, e);
  return a;
};
Keyboard.getShortcuts = function (b, a) {
  return Keyboard.getShortcut(b, a, { many: true });
};
HtmlTable = Class.refactor(HtmlTable, {
  options: {
    useKeyboard: true,
    classRowSelected: "table-tr-selected",
    classRowHovered: "table-tr-hovered",
    classSelectable: "table-selectable",
    shiftForMultiSelect: true,
    allowMultiSelect: true,
    selectable: false,
    selectHiddenRows: false,
  },
  initialize: function () {
    this.previous.apply(this, arguments);
    if (this.occluded) {
      return this.occluded;
    }
    this.selectedRows = new Elements();
    if (!this.bound) {
      this.bound = {};
    }
    this.bound.mouseleave = this.mouseleave.bind(this);
    this.bound.clickRow = this.clickRow.bind(this);
    this.bound.activateKeyboard = function () {
      if (this.keyboard && this.selectEnabled) {
        this.keyboard.activate();
      }
    }.bind(this);
    if (this.options.selectable) {
      this.enableSelect();
    }
  },
  empty: function () {
    this.selectNone();
    return this.previous();
  },
  enableSelect: function () {
    this.selectEnabled = true;
    this.attachSelects();
    this.element.addClass(this.options.classSelectable);
    return this;
  },
  disableSelect: function () {
    this.selectEnabled = false;
    this.attachSelects(false);
    this.element.removeClass(this.options.classSelectable);
    return this;
  },
  push: function () {
    var a = this.previous.apply(this, arguments);
    this.updateSelects();
    return a;
  },
  toggleRow: function (a) {
    return this[(this.isSelected(a) ? "de" : "") + "selectRow"](a);
  },
  selectRow: function (b, a) {
    if (this.isSelected(b) || (!a && !this.body.getChildren().contains(b))) {
      return;
    }
    if (!this.options.allowMultiSelect) {
      this.selectNone();
    }
    if (!this.isSelected(b)) {
      this.selectedRows.push(b);
      b.addClass(this.options.classRowSelected);
      this.fireEvent("rowFocus", [b, this.selectedRows]);
      this.fireEvent("stateChanged");
    }
    this.focused = b;
    document.clearSelection();
    return this;
  },
  isSelected: function (a) {
    return this.selectedRows.contains(a);
  },
  getSelected: function () {
    return this.selectedRows;
  },
  getSelected: function () {
    return this.selectedRows;
  },
  serialize: function () {
    var a = this.previous.apply(this, arguments) || {};
    if (this.options.selectable) {
      a.selectedRows = this.selectedRows.map(
        function (b) {
          return Array.indexOf(this.body.rows, b);
        }.bind(this)
      );
    }
    return a;
  },
  restore: function (a) {
    if (this.options.selectable && a.selectedRows) {
      a.selectedRows.each(
        function (b) {
          this.selectRow(this.body.rows[b]);
        }.bind(this)
      );
    }
    this.previous.apply(this, arguments);
  },
  deselectRow: function (b, a) {
    if (!this.isSelected(b) || (!a && !this.body.getChildren().contains(b))) {
      return;
    }
    this.selectedRows = new Elements(Array.from(this.selectedRows).erase(b));
    b.removeClass(this.options.classRowSelected);
    this.fireEvent("rowUnfocus", [b, this.selectedRows]);
    this.fireEvent("stateChanged");
    return this;
  },
  selectAll: function (a) {
    if (!a && !this.options.allowMultiSelect) {
      return;
    }
    this.selectRange(0, this.body.rows.length, a);
    return this;
  },
  selectNone: function () {
    return this.selectAll(true);
  },
  selectRange: function (b, a, f) {
    if (!this.options.allowMultiSelect && !f) {
      return;
    }
    var g = f ? "deselectRow" : "selectRow",
      e = Array.clone(this.body.rows);
    if (typeOf(b) == "element") {
      b = e.indexOf(b);
    }
    if (typeOf(a) == "element") {
      a = e.indexOf(a);
    }
    a = a < e.length - 1 ? a : e.length - 1;
    if (a < b) {
      var d = b;
      b = a;
      a = d;
    }
    for (var c = b; c <= a; c++) {
      if (this.options.selectHiddenRows || e[c].isDisplayed()) {
        this[g](e[c], true);
      }
    }
    return this;
  },
  deselectRange: function (b, a) {
    this.selectRange(b, a, true);
  },
  getSelected: function () {
    return this.selectedRows;
  },
  enterRow: function (a) {
    if (this.hovered) {
      this.hovered = this.leaveRow(this.hovered);
    }
    this.hovered = a.addClass(this.options.classRowHovered);
  },
  leaveRow: function (a) {
    a.removeClass(this.options.classRowHovered);
  },
  updateSelects: function () {
    Array.each(
      this.body.rows,
      function (a) {
        var b = a.retrieve("binders");
        if (!b && !this.selectEnabled) {
          return;
        }
        if (!b) {
          b = {
            mouseenter: this.enterRow.pass([a], this),
            mouseleave: this.leaveRow.pass([a], this),
          };
          a.store("binders", b);
        }
        if (this.selectEnabled) {
          a.addEvents(b);
        } else {
          a.removeEvents(b);
        }
      },
      this
    );
  },
  shiftFocus: function (b, a) {
    if (!this.focused) {
      return this.selectRow(this.body.rows[0], a);
    }
    var c = this.getRowByOffset(b, this.options.selectHiddenRows);
    if (c === null || this.focused == this.body.rows[c]) {
      return this;
    }
    this.toggleRow(this.body.rows[c], a);
  },
  clickRow: function (a, b) {
    var c =
      (a.shift || a.meta || a.control) && this.options.shiftForMultiSelect;
    if (
      !c &&
      !(a.rightClick && this.isSelected(b) && this.options.allowMultiSelect)
    ) {
      this.selectNone();
    }
    if (a.rightClick) {
      this.selectRow(b);
    } else {
      this.toggleRow(b);
    }
    if (a.shift) {
      this.selectRange(
        this.rangeStart || this.body.rows[0],
        b,
        this.rangeStart ? !this.isSelected(b) : true
      );
      this.focused = b;
    }
    this.rangeStart = b;
  },
  getRowByOffset: function (e, d) {
    if (!this.focused) {
      return 0;
    }
    var b = Array.indexOf(this.body.rows, this.focused);
    if ((b == 0 && e < 0) || (b == this.body.rows.length - 1 && e > 0)) {
      return null;
    }
    if (d) {
      b += e;
    } else {
      var a = 0,
        c = 0;
      if (e > 0) {
        while (c < e && b < this.body.rows.length - 1) {
          if (this.body.rows[++b].isDisplayed()) {
            c++;
          }
        }
      } else {
        while (c > e && b > 0) {
          if (this.body.rows[--b].isDisplayed()) {
            c--;
          }
        }
      }
    }
    return b;
  },
  attachSelects: function (d) {
    d = d != null ? d : true;
    var g = d ? "addEvents" : "removeEvents";
    this.element[g]({
      mouseleave: this.bound.mouseleave,
      click: this.bound.activateKeyboard,
    });
    this.body[g]({
      "click:relay(tr)": this.bound.clickRow,
      "contextmenu:relay(tr)": this.bound.clickRow,
    });
    if (this.options.useKeyboard || this.keyboard) {
      if (!this.keyboard) {
        this.keyboard = new Keyboard();
      }
      if (!this.selectKeysDefined) {
        this.selectKeysDefined = true;
        var f, e;
        var c = function (i) {
          var h = function (j) {
            clearTimeout(f);
            j.preventDefault();
            var k =
              this.body.rows[
                this.getRowByOffset(i, this.options.selectHiddenRows)
              ];
            if (j.shift && k && this.isSelected(k)) {
              this.deselectRow(this.focused);
              this.focused = k;
            } else {
              if (k && (!this.options.allowMultiSelect || !j.shift)) {
                this.selectNone();
              }
              this.shiftFocus(i, j);
            }
            if (e) {
              f = h.delay(100, this, j);
            } else {
              f = function () {
                e = true;
                h(j);
              }.delay(400);
            }
          }.bind(this);
          return h;
        }.bind(this);
        var b = function () {
          clearTimeout(f);
          e = false;
        };
        this.keyboard.addEvents({
          "keydown:shift+up": c(-1),
          "keydown:shift+down": c(1),
          "keyup:shift+up": b,
          "keyup:shift+down": b,
          "keyup:up": b,
          "keyup:down": b,
        });
        var a = "";
        if (
          this.options.allowMultiSelect &&
          this.options.shiftForMultiSelect &&
          this.options.useKeyboard
        ) {
          a = " (Shift multi-selects).";
        }
        this.keyboard.addShortcuts({
          "Select Previous Row": {
            keys: "up",
            shortcut: "up arrow",
            handler: c(-1),
            description: "Select the previous row in the table." + a,
          },
          "Select Next Row": {
            keys: "down",
            shortcut: "down arrow",
            handler: c(1),
            description: "Select the next row in the table." + a,
          },
        });
      }
      this.keyboard[d ? "activate" : "deactivate"]();
    }
    this.updateSelects();
  },
  mouseleave: function () {
    if (this.hovered) {
      this.leaveRow(this.hovered);
    }
  },
});
var Scroller = new Class({
  Implements: [Events, Options],
  options: {
    area: 20,
    velocity: 1,
    onChange: function (a, b) {
      this.element.scrollTo(a, b);
    },
    fps: 50,
  },
  initialize: function (b, a) {
    this.setOptions(a);
    this.element = document.id(b);
    this.docBody = document.id(this.element.getDocument().body);
    this.listener =
      typeOf(this.element) != "element" ? this.docBody : this.element;
    this.timer = null;
    this.bound = {
      attach: this.attach.bind(this),
      detach: this.detach.bind(this),
      getCoords: this.getCoords.bind(this),
    };
  },
  start: function () {
    this.listener.addEvents({
      mouseover: this.bound.attach,
      mouseleave: this.bound.detach,
    });
    return this;
  },
  stop: function () {
    this.listener.removeEvents({
      mouseover: this.bound.attach,
      mouseleave: this.bound.detach,
    });
    this.detach();
    this.timer = clearInterval(this.timer);
    return this;
  },
  attach: function () {
    this.listener.addEvent("mousemove", this.bound.getCoords);
  },
  detach: function () {
    this.listener.removeEvent("mousemove", this.bound.getCoords);
    this.timer = clearInterval(this.timer);
  },
  getCoords: function (a) {
    this.page = this.listener.get("tag") == "body" ? a.client : a.page;
    if (!this.timer) {
      this.timer = this.scroll.periodical(
        Math.round(1000 / this.options.fps),
        this
      );
    }
  },
  scroll: function () {
    var c = this.element.getSize(),
      a = this.element.getScroll(),
      h =
        this.element != this.docBody
          ? this.element.getOffsets()
          : { x: 0, y: 0 },
      d = this.element.getScrollSize(),
      g = { x: 0, y: 0 },
      e = this.options.area.top || this.options.area,
      b = this.options.area.bottom || this.options.area;
    for (var f in this.page) {
      if (this.page[f] < e + h[f] && a[f] != 0) {
        g[f] = (this.page[f] - e - h[f]) * this.options.velocity;
      } else {
        if (this.page[f] + b > c[f] + h[f] && a[f] + c[f] != d[f]) {
          g[f] = (this.page[f] - c[f] + b - h[f]) * this.options.velocity;
        }
      }
      g[f] = g[f].round();
    }
    if (g.y || g.x) {
      this.fireEvent("change", [a.x + g.x, a.y + g.y]);
    }
  },
});
(function () {
  var a = function (c, b) {
    return c ? (typeOf(c) == "function" ? c(b) : b.get(c)) : "";
  };
  this.Tips = new Class({
    Implements: [Events, Options],
    options: {
      onShow: function () {
        this.tip.setStyle("display", "block");
      },
      onHide: function () {
        this.tip.setStyle("display", "none");
      },
      title: "title",
      text: function (b) {
        return b.get("rel") || b.get("href");
      },
      showDelay: 100,
      hideDelay: 100,
      className: "tip-wrap",
      offset: { x: 16, y: 16 },
      windowPadding: { x: 0, y: 0 },
      fixed: false,
      waiAria: true,
    },
    initialize: function () {
      var b = Array.link(arguments, {
        options: Type.isObject,
        elements: function (c) {
          return c != null;
        },
      });
      this.setOptions(b.options);
      if (b.elements) {
        this.attach(b.elements);
      }
      this.container = new Element("div", { class: "tip" });
      if (this.options.id) {
        this.container.set("id", this.options.id);
        if (this.options.waiAria) {
          this.attachWaiAria();
        }
      }
    },
    toElement: function () {
      if (this.tip) {
        return this.tip;
      }
      this.tip = new Element("div", {
        class: this.options.className,
        styles: { position: "absolute", top: 0, left: 0 },
      }).adopt(
        new Element("div", { class: "tip-top" }),
        this.container,
        new Element("div", { class: "tip-bottom" })
      );
      return this.tip;
    },
    attachWaiAria: function () {
      var b = this.options.id;
      this.container.set("role", "tooltip");
      if (!this.waiAria) {
        this.waiAria = {
          show: function (c) {
            if (b) {
              c.set("aria-describedby", b);
            }
            this.container.set("aria-hidden", "false");
          },
          hide: function (c) {
            if (b) {
              c.erase("aria-describedby");
            }
            this.container.set("aria-hidden", "true");
          },
        };
      }
      this.addEvents(this.waiAria);
    },
    detachWaiAria: function () {
      if (this.waiAria) {
        this.container.erase("role");
        this.container.erase("aria-hidden");
        this.removeEvents(this.waiAria);
      }
    },
    attach: function (b) {
      $$(b).each(function (d) {
        var f = a(this.options.title, d),
          e = a(this.options.text, d);
        d.set("title", "").store("tip:native", f).retrieve("tip:title", f);
        d.retrieve("tip:text", e);
        this.fireEvent("attach", [d]);
        var c = ["enter", "leave"];
        if (!this.options.fixed) {
          c.push("move");
        }
        c.each(function (h) {
          var g = d.retrieve("tip:" + h);
          if (!g) {
            g = function (i) {
              this["element" + h.capitalize()].apply(this, [i, d]);
            }.bind(this);
          }
          d.store("tip:" + h, g).addEvent("mouse" + h, g);
        }, this);
      }, this);
      return this;
    },
    detach: function (b) {
      $$(b).each(function (d) {
        ["enter", "leave", "move"].each(function (e) {
          d.removeEvent("mouse" + e, d.retrieve("tip:" + e)).eliminate(
            "tip:" + e
          );
        });
        this.fireEvent("detach", [d]);
        if (this.options.title == "title") {
          var c = d.retrieve("tip:native");
          if (c) {
            d.set("title", c);
          }
        }
      }, this);
      return this;
    },
    elementEnter: function (c, b) {
      clearTimeout(this.timer);
      this.timer = function () {
        this.container.empty();
        ["title", "text"].each(function (e) {
          var d = b.retrieve("tip:" + e);
          var f = (this["_" + e + "Element"] = new Element("div", {
            class: "tip-" + e,
          }).inject(this.container));
          if (d) {
            this.fill(f, d);
          }
        }, this);
        this.show(b);
        this.position(this.options.fixed ? { page: b.getPosition() } : c);
      }.delay(this.options.showDelay, this);
    },
    elementLeave: function (c, b) {
      clearTimeout(this.timer);
      this.timer = this.hide.delay(this.options.hideDelay, this, b);
      this.fireForParent(c, b);
    },
    setTitle: function (b) {
      if (this._titleElement) {
        this._titleElement.empty();
        this.fill(this._titleElement, b);
      }
      return this;
    },
    setText: function (b) {
      if (this._textElement) {
        this._textElement.empty();
        this.fill(this._textElement, b);
      }
      return this;
    },
    fireForParent: function (c, b) {
      b = b.getParent();
      if (!b || b == document.body) {
        return;
      }
      if (b.retrieve("tip:enter")) {
        b.fireEvent("mouseenter", c);
      } else {
        this.fireForParent(c, b);
      }
    },
    elementMove: function (c, b) {
      this.position(c);
    },
    position: function (f) {
      if (!this.tip) {
        document.id(this);
      }
      var c = window.getSize(),
        b = window.getScroll(),
        g = { x: this.tip.offsetWidth, y: this.tip.offsetHeight },
        d = { x: "left", y: "top" },
        e = { y: false, x2: false, y2: false, x: false },
        h = {};
      for (var i in d) {
        h[d[i]] = f.page[i] + this.options.offset[i];
        if (h[d[i]] < 0) {
          e[i] = true;
        }
        if (h[d[i]] + g[i] - b[i] > c[i] - this.options.windowPadding[i]) {
          h[d[i]] = f.page[i] - this.options.offset[i] - g[i];
          e[i + "2"] = true;
        }
      }
      this.fireEvent("bound", e);
      this.tip.setStyles(h);
    },
    fill: function (b, c) {
      if (typeof c == "string") {
        b.set("html", c);
      } else {
        b.adopt(c);
      }
    },
    show: function (b) {
      if (!this.tip) {
        document.id(this);
      }
      if (!this.tip.getParent()) {
        this.tip.inject(document.body);
      }
      this.fireEvent("show", [this.tip, b]);
    },
    hide: function (b) {
      if (!this.tip) {
        document.id(this);
      }
      this.fireEvent("hide", [this.tip, b]);
    },
  });
})();
(function () {
  var a = { json: JSON.decode };
  Locale.Set.defineParser = function (b, c) {
    a[b] = c;
  };
  Locale.Set.from = function (d, c) {
    if (instanceOf(d, Locale.Set)) {
      return d;
    }
    if (!c && typeOf(d) == "string") {
      c = "json";
    }
    if (a[c]) {
      d = a[c](d);
    }
    var b = new Locale.Set();
    b.sets = d.sets || {};
    if (d.inherits) {
      b.inherits.locales = Array.from(d.inherits.locales);
      b.inherits.sets = d.inherits.sets || {};
    }
    return b;
  };
})();
Locale.define("ar", "Date", {
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
});
Locale.define("ar", "FormValidator", {
  required: "Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„ Щ…Ш·Щ„Щ€ШЁ.",
  minLength:
    "Ш±Ш¬Ш§ШЎЩ‹ ШҐШЇШ®Ш§Щ„ {minLength} ШЈШ­Ш±ЩЃ Ш№Щ„Щ‰ Ш§Щ„ШЈЩ‚Щ„ (ШЄЩ… ШҐШЇШ®Ш§Щ„ {length} ШЈШ­Ш±ЩЃ).",
  maxLength:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ Ш№ШЇЩ… ШҐШЇШ®Ш§Щ„ ШЈЩѓШ«Ш± Щ…Щ† {maxLength} ШЈШ­Ш±ЩЃ (ШЄЩ… ШҐШЇШ®Ш§Щ„ {length} ШЈШ­Ш±ЩЃ).",
  integer:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ Ш№ШЇШЇ ШµШ­ЩЉШ­ ЩЃЩЉ Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„. ШЈЩЉ Ш±Щ‚Щ… Ш°Щ€ ЩѓШіШ± Ш№ШґШ±ЩЉ ШЈЩ€ Щ…Ш¦Щ€ЩЉ (Щ…Ш«Ш§Щ„ 1.25 ) ШєЩЉШ± Щ…ШіЩ…Щ€Ш­.",
  numeric:
    'Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ Щ‚ЩЉЩ… Ш±Щ‚Щ…ЩЉШ© ЩЃЩЉ Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„ (Щ…Ш«Ш§Щ„ "1" ШЈЩ€ "1.1" ШЈЩ€ "-1" ШЈЩ€ "-1.1").',
  digits:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШЈШіШЄШ®ШЇШ§Щ… Щ‚ЩЉЩ… Ш±Щ‚Щ…ЩЉШ© Щ€Ш№Щ„Ш§Щ…Ш§ШЄ ШЄШ±Щ‚ЩЉЩ…ЩЉШ© ЩЃЩ‚Ш· ЩЃЩЉ Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„ (Щ…Ш«Ш§Щ„, Ш±Щ‚Щ… Щ‡Ш§ШЄЩЃ Щ…Ш№ Щ†Щ‚Ш·Ш© ШЈЩ€ ШґШ­Ш·Ш©)",
  alpha:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШЈШіШЄШ®ШЇШ§Щ… ШЈШ­Ш±ЩЃ ЩЃЩ‚Ш· (Ш§-ЩЉ) ЩЃЩЉ Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„. ШЈЩЉ ЩЃШ±Ш§ШєШ§ШЄ ШЈЩ€ Ш№Щ„Ш§Щ…Ш§ШЄ ШєЩЉШ± Щ…ШіЩ…Щ€Ш­Ш©.",
  alphanum:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШЈШіШЄШ®ШЇШ§Щ… ШЈШ­Ш±ЩЃ ЩЃЩ‚Ш· (Ш§-ЩЉ) ШЈЩ€ ШЈШ±Щ‚Ш§Щ… (0-9) ЩЃЩ‚Ш· ЩЃЩЉ Щ‡Ш°Ш§ Ш§Щ„Ш­Щ‚Щ„. ШЈЩЉ ЩЃШ±Ш§ШєШ§ШЄ ШЈЩ€ Ш№Щ„Ш§Щ…Ш§ШЄ ШєЩЉШ± Щ…ШіЩ…Щ€Ш­Ш©.",
  dateSuchAs:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ ШЄШ§Ш±ЩЉШ® ШµШ­ЩЉШ­ ЩѓШ§Щ„ШЄШ§Щ„ЩЉ {date}",
  dateInFormatMDY:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ ШЄШ§Ш±ЩЉШ® ШµШ­ЩЉШ­ (Щ…Ш«Ш§Щ„, 31-12-1999)",
  email: "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ ШЁШ±ЩЉШЇ ШҐЩ„ЩѓШЄШ±Щ€Щ†ЩЉ ШµШ­ЩЉШ­.",
  url: "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ Ш№Щ†Щ€Ш§Щ† ШҐЩ„ЩѓШЄШ±Щ€Щ†ЩЉ ШµШ­ЩЉШ­ Щ…Ш«Щ„ http://www.example.com",
  currencyDollar:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ Щ‚ЩЉЩ…Ш© $ ШµШ­ЩЉШ­Ш©. Щ…Ш«Ш§Щ„, 100.00$",
  oneRequired:
    "Ш§Щ„Ш±Ш¬Ш§ШЎ ШҐШЇШ®Ш§Щ„ Щ‚ЩЉЩ…Ш© ЩЃЩЉ ШЈШ­ШЇ Щ‡Ш°Щ‡ Ш§Щ„Ш­Щ‚Щ€Щ„ Ш№Щ„Щ‰ Ш§Щ„ШЈЩ‚Щ„.",
  errorPrefix: "Ш®Ш·ШЈ: ",
  warningPrefix: "ШЄШ­Ш°ЩЉШ±: ",
});
Locale.define("ca-CA", "Date", {
  months: [
    "Gener",
    "Febrer",
    "MarГ§",
    "Abril",
    "Maig",
    "Juny",
    "Juli",
    "Agost",
    "Setembre",
    "Octubre",
    "Novembre",
    "Desembre",
  ],
  months_abbr: [
    "gen.",
    "febr.",
    "marГ§",
    "abr.",
    "maig",
    "juny",
    "jul.",
    "ag.",
    "set.",
    "oct.",
    "nov.",
    "des.",
  ],
  days: [
    "Diumenge",
    "Dilluns",
    "Dimarts",
    "Dimecres",
    "Dijous",
    "Divendres",
    "Dissabte",
  ],
  days_abbr: ["dg", "dl", "dt", "dc", "dj", "dv", "ds"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 0,
  ordinal: "",
  lessThanMinuteAgo: "fa menys d`un minut",
  minuteAgo: "fa un minut",
  minutesAgo: "fa {delta} minuts",
  hourAgo: "fa un hora",
  hoursAgo: "fa unes {delta} hores",
  dayAgo: "fa un dia",
  daysAgo: "fa {delta} dies",
  lessThanMinuteUntil: "menys d`un minut des d`ara",
  minuteUntil: "un minut des d`ara",
  minutesUntil: "{delta} minuts des d`ara",
  hourUntil: "un hora des d`ara",
  hoursUntil: "unes {delta} hores des d`ara",
  dayUntil: "1 dia des d`ara",
  daysUntil: "{delta} dies des d`ara",
});
Locale.define("ca-CA", "FormValidator", {
  required: "Aquest camp es obligatori.",
  minLength:
    "Per favor introdueix al menys {minLength} caracters (has introduit {length} caracters).",
  maxLength:
    "Per favor introdueix no mes de {maxLength} caracters (has introduit {length} caracters).",
  integer:
    "Per favor introdueix un nombre enter en aquest camp. Nombres amb decimals (p.e. 1,25) no estan permesos.",
  numeric:
    'Per favor introdueix sols valors numerics en aquest camp (p.e. "1" o "1,1" o "-1" o "-1,1").',
  digits:
    "Per favor usa sols numeros i puntuacio en aquest camp (per exemple, un nombre de telefon amb guions i punts no esta permes).",
  alpha:
    "Per favor utilitza lletres nomes (a-z) en aquest camp. No sВґadmiteixen espais ni altres caracters.",
  alphanum:
    "Per favor, utilitza nomes lletres (a-z) o numeros (0-9) en aquest camp. No sВґadmiteixen espais ni altres caracters.",
  dateSuchAs: "Per favor introdueix una data valida com {date}",
  dateInFormatMDY:
    'Per favor introdueix una data valida com DD/MM/YYYY (p.e. "31/12/1999")',
  email:
    'Per favor, introdueix una adreГ§a de correu electronic valida. Per exemple, "fred@domain.com".',
  url: "Per favor introdueix una URL valida com http://www.example.com.",
  currencyDollar:
    "Per favor introdueix una quantitat valida de в‚¬. Per exemple в‚¬100,00 .",
  oneRequired:
    "Per favor introdueix alguna cosa per al menys una dВґaquestes entrades.",
  errorPrefix: "Error: ",
  warningPrefix: "Avis: ",
  noSpace: "No poden haver espais en aquesta entrada.",
  reqChkByNode: "No hi han elements seleccionats.",
  requiredChk: "Aquest camp es obligatori.",
  reqChkByName: "Per favor selecciona una {label}.",
  match: "Aquest camp necessita coincidir amb el camp {matchName}",
  startDate: "la data de inici",
  endDate: "la data de fi",
  currendDate: "la data actual",
  afterDate: "La data deu ser igual o posterior a {label}.",
  beforeDate: "La data deu ser igual o anterior a {label}.",
  startMonth: "Per favor selecciona un mes dВґorige",
  sameMonth:
    "Aquestes dos dates deuen estar dins del mateix mes - deus canviar una o altra.",
});
(function () {
  var a = function (e, d, c, b) {
    if (e == 1) {
      return d;
    } else {
      if (e == 2 || e == 3 || e == 4) {
        return c;
      } else {
        return b;
      }
    }
  };
  Locale.define("cs-CZ", "Date", {
    months: [
      "Leden",
      "Гљnor",
      "BЕ™ezen",
      "Duben",
      "KvД›ten",
      "ДЊerven",
      "ДЊervenec",
      "Srpen",
      "ZГЎЕ™Г­",
      "ЕГ­jen",
      "Listopad",
      "Prosinec",
    ],
    months_abbr: [
      "ledna",
      "Гєnora",
      "bЕ™ezna",
      "dubna",
      "kvД›tna",
      "ДЌervna",
      "ДЌervence",
      "srpna",
      "zГЎЕ™Г­",
      "Е™Г­jna",
      "listopadu",
      "prosince",
    ],
    days: [
      "NedД›le",
      "PondД›lГ­",
      "ГљterГЅ",
      "StЕ™eda",
      "ДЊtvrtek",
      "PГЎtek",
      "Sobota",
    ],
    days_abbr: ["ne", "po", "Гєt", "st", "ДЌt", "pГЎ", "so"],
    dateOrder: ["date", "month", "year"],
    shortDate: "%d.%m.%Y",
    shortTime: "%H:%M",
    AM: "dop.",
    PM: "odp.",
    firstDayOfWeek: 1,
    ordinal: ".",
    lessThanMinuteAgo: "pЕ™ed chvГ­lГ­",
    minuteAgo: "pЕ™ibliЕѕnД› pЕ™ed minutou",
    minutesAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "minutou", "minutami", "minutami");
    },
    hourAgo: "pЕ™ibliЕѕnД› pЕ™ed hodinou",
    hoursAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "hodinou", "hodinami", "hodinami");
    },
    dayAgo: "pЕ™ed dnem",
    daysAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "dnem", "dny", "dny");
    },
    weekAgo: "pЕ™ed tГЅdnem",
    weeksAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "tГЅdnem", "tГЅdny", "tГЅdny");
    },
    monthAgo: "pЕ™ed mД›sГ­cem",
    monthsAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "mД›sГ­cem", "mД›sГ­ci", "mД›sГ­ci");
    },
    yearAgo: "pЕ™ed rokem",
    yearsAgo: function (b) {
      return "pЕ™ed {delta} " + a(b, "rokem", "lety", "lety");
    },
    lessThanMinuteUntil: "za chvГ­li",
    minuteUntil: "pЕ™ibliЕѕnД› za minutu",
    minutesUntil: function (b) {
      return "za {delta} " + a(b, "minutu", "minuty", "minut");
    },
    hourUntil: "pЕ™ibliЕѕnД› za hodinu",
    hoursUntil: function (b) {
      return "za {delta} " + a(b, "hodinu", "hodiny", "hodin");
    },
    dayUntil: "za den",
    daysUntil: function (b) {
      return "za {delta} " + a(b, "den", "dny", "dnЕЇ");
    },
    weekUntil: "za tГЅden",
    weeksUntil: function (b) {
      return "za {delta} " + a(b, "tГЅden", "tГЅdny", "tГЅdnЕЇ");
    },
    monthUntil: "za mД›sГ­c",
    monthsUntil: function (b) {
      return "za {delta} " + a(b, "mД›sГ­c", "mД›sГ­ce", "mД›sГ­cЕЇ");
    },
    yearUntil: "za rok",
    yearsUntil: function (b) {
      return "za {delta} " + a(b, "rok", "roky", "let");
    },
  });
})();
Locale.define("cs-CZ", "FormValidator", {
  required: "Tato poloЕѕka je povinnГЎ.",
  minLength:
    "Zadejte prosГ­m alespoЕ€ {minLength} znakЕЇ (napsГЎno {length} znakЕЇ).",
  maxLength:
    "Zadejte prosГ­m mГ©nД› neЕѕ {maxLength} znakЕЇ (nГЎpsГЎno {length} znakЕЇ).",
  integer:
    "Zadejte prosГ­m celГ© ДЌГ­slo. DesetinnГЎ ДЌГ­sla (napЕ™. 1.25) nejsou povolena.",
  numeric:
    'Zadejte jen ДЌГ­selnГ© hodnoty (tj. "1" nebo "1.1" nebo "-1" nebo "-1.1").',
  digits:
    "Zadejte prosГ­m pouze ДЌГ­sla a interpunkДЌnГ­ znamГ©nka(napЕ™Г­klad telefonnГ­ ДЌГ­slo s pomlДЌkami nebo teДЌkami je povoleno).",
  alpha:
    "Zadejte prosГ­m pouze pГ­smena (a-z). Mezery nebo jinГ© znaky nejsou povoleny.",
  alphanum:
    "Zadejte prosГ­m pouze pГ­smena (a-z) nebo ДЌГ­slice (0-9). Mezery nebo jinГ© znaky nejsou povoleny.",
  dateSuchAs: "Zadejte prosГ­m platnГ© datum jako {date}",
  dateInFormatMDY:
    'Zadejte prosГ­m platnГ© datum jako MM / DD / RRRR (tj. "12/31/1999")',
  email:
    'Zadejte prosГ­m platnou e-mailovou adresu. NapЕ™Г­klad "fred@domain.com".',
  url: "Zadejte prosГ­m platnou URL adresu jako http://www.example.com.",
  currencyDollar: "Zadejte prosГ­m platnou ДЌГЎstku. NapЕ™Г­klad $100.00.",
  oneRequired: "Zadejte prosГ­m alespoЕ€ jednu hodnotu pro tyto poloЕѕky.",
  errorPrefix: "Chyba: ",
  warningPrefix: "UpozornД›nГ­: ",
  noSpace: "V tГ©to poloЕѕce nejsou povoleny mezery",
  reqChkByNode: "Nejsou vybrГЎny ЕѕГЎdnГ© poloЕѕky.",
  requiredChk: "Tato poloЕѕka je vyЕѕadovГЎna.",
  reqChkByName: "ProsГ­m vyberte {label}.",
  match: "Tato poloЕѕka se musГ­ shodovat s poloЕѕkou {matchName}",
  startDate: "datum zahГЎjenГ­",
  endDate: "datum ukonДЌenГ­",
  currendDate: "aktuГЎlnГ­ datum",
  afterDate: "Datum by mД›lo bГЅt stejnГ© nebo vД›tЕЎГ­ neЕѕ {label}.",
  beforeDate: "Datum by mД›lo bГЅt stejnГ© nebo menЕЎГ­ neЕѕ {label}.",
  startMonth: "Vyberte poДЌГЎteДЌnГ­ mД›sГ­c.",
  sameMonth:
    "Tyto dva datumy musГ­ bГЅt ve stejnГ©m mД›sГ­ci - zmД›Е€te jeden z nich.",
  creditcard:
    "ZadanГ© ДЌГ­slo kreditnГ­ karty je neplatnГ©. ProsГ­m opravte ho. Bylo zadГЎno {length} ДЌГ­sel.",
});
Locale.define("da-DK", "Date", {
  months: [
    "Januar",
    "Februar",
    "Marts",
    "April",
    "Maj",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "December",
  ],
  months_abbr: [
    "jan.",
    "feb.",
    "mar.",
    "apr.",
    "maj.",
    "jun.",
    "jul.",
    "aug.",
    "sep.",
    "okt.",
    "nov.",
    "dec.",
  ],
  days: [
    "SГёndag",
    "Mandag",
    "Tirsdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "LГёrdag",
  ],
  days_abbr: ["sГёn", "man", "tir", "ons", "tor", "fre", "lГёr"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d-%m-%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: ".",
  lessThanMinuteAgo: "mindre end et minut siden",
  minuteAgo: "omkring et minut siden",
  minutesAgo: "{delta} minutter siden",
  hourAgo: "omkring en time siden",
  hoursAgo: "omkring {delta} timer siden",
  dayAgo: "1 dag siden",
  daysAgo: "{delta} dage siden",
  weekAgo: "1 uge siden",
  weeksAgo: "{delta} uger siden",
  monthAgo: "1 mГҐned siden",
  monthsAgo: "{delta} mГҐneder siden",
  yearAgo: "1 ГҐr siden",
  yearsAgo: "{delta} ГҐr siden",
  lessThanMinuteUntil: "mindre end et minut fra nu",
  minuteUntil: "omkring et minut fra nu",
  minutesUntil: "{delta} minutter fra nu",
  hourUntil: "omkring en time fra nu",
  hoursUntil: "omkring {delta} timer fra nu",
  dayUntil: "1 dag fra nu",
  daysUntil: "{delta} dage fra nu",
  weekUntil: "1 uge fra nu",
  weeksUntil: "{delta} uger fra nu",
  monthUntil: "1 mГҐned fra nu",
  monthsUntil: "{delta} mГҐneder fra nu",
  yearUntil: "1 ГҐr fra nu",
  yearsUntil: "{delta} ГҐr fra nu",
});
Locale.define("da-DK", "FormValidator", {
  required: "Feltet skal udfyldes.",
  minLength: "Skriv mindst {minLength} tegn (du skrev {length} tegn).",
  maxLength: "Skriv maksimalt {maxLength} tegn (du skrev {length} tegn).",
  integer:
    "Skriv et tal i dette felt. Decimal tal (f.eks. 1.25) er ikke tilladt.",
  numeric:
    'Skriv kun tal i dette felt (i.e. "1" eller "1.1" eller "-1" eller "-1.1").',
  digits:
    "Skriv kun tal og tegnsГ¦tning i dette felt (eksempel, et telefon nummer med bindestreg eller punktum er tilladt).",
  alpha:
    "Skriv kun bogstaver (a-z) i dette felt. Mellemrum og andre tegn er ikke tilladt.",
  alphanum:
    "Skriv kun bogstaver (a-z) eller tal (0-9) i dette felt. Mellemrum og andre tegn er ikke tilladt.",
  dateSuchAs: "Skriv en gyldig dato som {date}",
  dateInFormatMDY: 'Skriv dato i formatet DD-MM-YYYY (f.eks. "31-12-1999")',
  email: 'Skriv en gyldig e-mail adresse. F.eks "fred@domain.com".',
  url: 'Skriv en gyldig URL adresse. F.eks "http://www.example.com".',
  currencyDollar: "Skriv et gldigt belГёb. F.eks Kr.100.00 .",
  oneRequired: "Et eller flere af felterne i denne formular skal udfyldes.",
  errorPrefix: "Fejl: ",
  warningPrefix: "Advarsel: ",
  noSpace: "Der mГҐ ikke benyttes mellemrum i dette felt.",
  reqChkByNode: "Foretag et valg.",
  requiredChk: "Dette felt skal udfyldes.",
  reqChkByName: "VГ¦lg en {label}.",
  match: "Dette felt skal matche {matchName} feltet",
  startDate: "start dato",
  endDate: "slut dato",
  currendDate: "dags dato",
  afterDate: "Datoen skal vГ¦re stГёrre end eller lig med {label}.",
  beforeDate: "Datoen skal vГ¦re mindre end eller lig med {label}.",
  startMonth: "VГ¦lg en start mГҐned",
  sameMonth: "De valgte datoer skal vГ¦re i samme mГҐned - skift en af dem.",
});
Locale.define("de-DE", "Date", {
  months: [
    "Januar",
    "Februar",
    "MГ¤rz",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
  ],
  months_abbr: [
    "Jan",
    "Feb",
    "MГ¤r",
    "Apr",
    "Mai",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dez",
  ],
  days: [
    "Sonntag",
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
  ],
  days_abbr: ["So.", "Mo.", "Di.", "Mi.", "Do.", "Fr.", "Sa."],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d.%m.%Y",
  shortTime: "%H:%M",
  AM: "vormittags",
  PM: "nachmittags",
  firstDayOfWeek: 1,
  ordinal: ".",
  lessThanMinuteAgo: "vor weniger als einer Minute",
  minuteAgo: "vor einer Minute",
  minutesAgo: "vor {delta} Minuten",
  hourAgo: "vor einer Stunde",
  hoursAgo: "vor {delta} Stunden",
  dayAgo: "vor einem Tag",
  daysAgo: "vor {delta} Tagen",
  weekAgo: "vor einer Woche",
  weeksAgo: "vor {delta} Wochen",
  monthAgo: "vor einem Monat",
  monthsAgo: "vor {delta} Monaten",
  yearAgo: "vor einem Jahr",
  yearsAgo: "vor {delta} Jahren",
  lessThanMinuteUntil: "in weniger als einer Minute",
  minuteUntil: "in einer Minute",
  minutesUntil: "in {delta} Minuten",
  hourUntil: "in ca. einer Stunde",
  hoursUntil: "in ca. {delta} Stunden",
  dayUntil: "in einem Tag",
  daysUntil: "in {delta} Tagen",
  weekUntil: "in einer Woche",
  weeksUntil: "in {delta} Wochen",
  monthUntil: "in einem Monat",
  monthsUntil: "in {delta} Monaten",
  yearUntil: "in einem Jahr",
  yearsUntil: "in {delta} Jahren",
});
Locale.define("de-CH").inherit("de-DE", "Date");
Locale.define("de-CH", "FormValidator", {
  required: "Dieses Feld ist obligatorisch.",
  minLength:
    "Geben Sie bitte mindestens {minLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).",
  maxLength:
    "Bitte geben Sie nicht mehr als {maxLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).",
  integer:
    "Geben Sie bitte eine ganze Zahl ein. Dezimalzahlen (z.B. 1.25) sind nicht erlaubt.",
  numeric:
    "Geben Sie bitte nur Zahlenwerte in dieses Eingabefeld ein (z.B. &quot;1&quot;, &quot;1.1&quot;, &quot;-1&quot; oder &quot;-1.1&quot;).",
  digits:
    "Benutzen Sie bitte nur Zahlen und Satzzeichen in diesem Eingabefeld (erlaubt ist z.B. eine Telefonnummer mit Bindestrichen und Punkten).",
  alpha:
    "Benutzen Sie bitte nur Buchstaben (a-z) in diesem Feld. Leerzeichen und andere Zeichen sind nicht erlaubt.",
  alphanum:
    "Benutzen Sie bitte nur Buchstaben (a-z) und Zahlen (0-9) in diesem Eingabefeld. Leerzeichen und andere Zeichen sind nicht erlaubt.",
  dateSuchAs:
    "Geben Sie bitte ein g&uuml;ltiges Datum ein. Wie zum Beispiel {date}",
  dateInFormatMDY:
    "Geben Sie bitte ein g&uuml;ltiges Datum ein. Wie zum Beispiel TT.MM.JJJJ (z.B. &quot;31.12.1999&quot;)",
  email:
    "Geben Sie bitte eine g&uuml;ltige E-Mail Adresse ein. Wie zum Beispiel &quot;maria@bernasconi.ch&quot;.",
  url: "Geben Sie bitte eine g&uuml;ltige URL ein. Wie zum Beispiel http://www.example.com.",
  currencyDollar:
    "Geben Sie bitte einen g&uuml;ltigen Betrag in Schweizer Franken ein. Wie zum Beispiel 100.00 CHF .",
  oneRequired:
    "Machen Sie f&uuml;r mindestens eines der Eingabefelder einen Eintrag.",
  errorPrefix: "Fehler: ",
  warningPrefix: "Warnung: ",
  noSpace: "In diesem Eingabefeld darf kein Leerzeichen sein.",
  reqChkByNode: "Es wurden keine Elemente gew&auml;hlt.",
  requiredChk: "Dieses Feld ist obligatorisch.",
  reqChkByName: "Bitte w&auml;hlen Sie ein {label}.",
  match:
    "Dieses Eingabefeld muss mit dem Feld {matchName} &uuml;bereinstimmen.",
  startDate: "Das Anfangsdatum",
  endDate: "Das Enddatum",
  currendDate: "Das aktuelle Datum",
  afterDate:
    "Das Datum sollte zur gleichen Zeit oder sp&auml;ter sein {label}.",
  beforeDate:
    "Das Datum sollte zur gleichen Zeit oder fr&uuml;her sein {label}.",
  startMonth: "W&auml;hlen Sie bitte einen Anfangsmonat",
  sameMonth:
    "Diese zwei Datumsangaben m&uuml;ssen im selben Monat sein - Sie m&uuml;ssen eine von beiden ver&auml;ndern.",
  creditcard:
    "Die eingegebene Kreditkartennummer ist ung&uuml;ltig. Bitte &uuml;berpr&uuml;fen Sie diese und versuchen Sie es erneut. {length} Zahlen eingegeben.",
});
Locale.define("de-DE", "FormValidator", {
  required: "Dieses Eingabefeld muss ausgefГјllt werden.",
  minLength:
    "Geben Sie bitte mindestens {minLength} Zeichen ein (Sie haben nur {length} Zeichen eingegeben).",
  maxLength:
    "Geben Sie bitte nicht mehr als {maxLength} Zeichen ein (Sie haben {length} Zeichen eingegeben).",
  integer:
    'Geben Sie in diesem Eingabefeld bitte eine ganze Zahl ein. Dezimalzahlen (z.B. "1.25") sind nicht erlaubt.',
  numeric:
    'Geben Sie in diesem Eingabefeld bitte nur Zahlenwerte (z.B. "1", "1.1", "-1" oder "-1.1") ein.',
  digits:
    "Geben Sie in diesem Eingabefeld bitte nur Zahlen und Satzzeichen ein (z.B. eine Telefonnummer mit Bindestrichen und Punkten ist erlaubt).",
  alpha:
    "Geben Sie in diesem Eingabefeld bitte nur Buchstaben (a-z) ein. Leerzeichen und andere Zeichen sind nicht erlaubt.",
  alphanum:
    "Geben Sie in diesem Eingabefeld bitte nur Buchstaben (a-z) und Zahlen (0-9) ein. Leerzeichen oder andere Zeichen sind nicht erlaubt.",
  dateSuchAs: 'Geben Sie bitte ein gГјltiges Datum ein (z.B. "{date}").',
  dateInFormatMDY:
    'Geben Sie bitte ein gГјltiges Datum im Format TT.MM.JJJJ ein (z.B. "31.12.1999").',
  email:
    'Geben Sie bitte eine gГјltige E-Mail-Adresse ein (z.B. "max@mustermann.de").',
  url: 'Geben Sie bitte eine gГјltige URL ein (z.B. "http://www.example.com").',
  currencyDollar:
    "Geben Sie bitte einen gГјltigen Betrag in EURO ein (z.B. 100.00в‚¬).",
  oneRequired: "Bitte fГјllen Sie mindestens ein Eingabefeld aus.",
  errorPrefix: "Fehler: ",
  warningPrefix: "Warnung: ",
  noSpace: "Es darf kein Leerzeichen in diesem Eingabefeld sein.",
  reqChkByNode: "Es wurden keine Elemente gewГ¤hlt.",
  requiredChk: "Dieses Feld muss ausgefГјllt werden.",
  reqChkByName: "Bitte wГ¤hlen Sie ein {label}.",
  match:
    "Dieses Eingabefeld muss mit dem {matchName} Eingabefeld Гјbereinstimmen.",
  startDate: "Das Anfangsdatum",
  endDate: "Das Enddatum",
  currendDate: "Das aktuelle Datum",
  afterDate:
    "Das Datum sollte zur gleichen Zeit oder spГ¤ter sein als {label}.",
  beforeDate:
    "Das Datum sollte zur gleichen Zeit oder frГјher sein als {label}.",
  startMonth: "WГ¤hlen Sie bitte einen Anfangsmonat",
  sameMonth:
    "Diese zwei Datumsangaben mГјssen im selben Monat sein - Sie mГјssen eines von beiden verГ¤ndern.",
  creditcard:
    "Die eingegebene Kreditkartennummer ist ungГјltig. Bitte ГјberprГјfen Sie diese und versuchen Sie es erneut. {length} Zahlen eingegeben.",
});
Locale.define("EU", "Number", {
  decimal: ",",
  group: ".",
  currency: { prefix: "в‚¬ " },
});
Locale.define("de-DE").inherit("EU", "Number");
Locale.define("en-GB", "Date", {
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
}).inherit("en-US", "Date");
Locale.define("es-ES", "Date", {
  months: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  months_abbr: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  days: [
    "Domingo",
    "Lunes",
    "Martes",
    "MiГ©rcoles",
    "Jueves",
    "Viernes",
    "SГЎbado",
  ],
  days_abbr: ["dom", "lun", "mar", "miГ©", "juv", "vie", "sГЎb"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "",
  lessThanMinuteAgo: "hace menos de un minuto",
  minuteAgo: "hace un minuto",
  minutesAgo: "hace {delta} minutos",
  hourAgo: "hace una hora",
  hoursAgo: "hace unas {delta} horas",
  dayAgo: "hace un dГ­a",
  daysAgo: "hace {delta} dГ­as",
  weekAgo: "hace una semana",
  weeksAgo: "hace unas {delta} semanas",
  monthAgo: "hace un mes",
  monthsAgo: "hace {delta} meses",
  yearAgo: "hace un aГ±o",
  yearsAgo: "hace {delta} aГ±os",
  lessThanMinuteUntil: "menos de un minuto desde ahora",
  minuteUntil: "un minuto desde ahora",
  minutesUntil: "{delta} minutos desde ahora",
  hourUntil: "una hora desde ahora",
  hoursUntil: "unas {delta} horas desde ahora",
  dayUntil: "un dГ­a desde ahora",
  daysUntil: "{delta} dГ­as desde ahora",
  weekUntil: "una semana desde ahora",
  weeksUntil: "unas {delta} semanas desde ahora",
  monthUntil: "un mes desde ahora",
  monthsUntil: "{delta} meses desde ahora",
  yearUntil: "un aГ±o desde ahora",
  yearsUntil: "{delta} aГ±os desde ahora",
});
Locale.define("es-AR").inherit("es-ES", "Date");
Locale.define("es-AR", "FormValidator", {
  required: "Este campo es obligatorio.",
  minLength:
    "Por favor ingrese al menos {minLength} caracteres (ha ingresado {length} caracteres).",
  maxLength:
    "Por favor no ingrese mГЎs de {maxLength} caracteres (ha ingresado {length} caracteres).",
  integer:
    "Por favor ingrese un nГєmero entero en este campo. NГєmeros con decimales (p.e. 1,25) no se permiten.",
  numeric:
    'Por favor ingrese solo valores numГ©ricos en este campo (p.e. "1" o "1,1" o "-1" o "-1,1").',
  digits:
    "Por favor use sГіlo nГєmeros y puntuaciГіn en este campo (por ejemplo, un nГєmero de telГ©fono con guiones y/o puntos no estГЎ permitido).",
  alpha:
    "Por favor use sГіlo letras (a-z) en este campo. No se permiten espacios ni otros caracteres.",
  alphanum:
    "Por favor, usa sГіlo letras (a-z) o nГєmeros (0-9) en este campo. No se permiten espacios u otros caracteres.",
  dateSuchAs: "Por favor ingrese una fecha vГЎlida como {date}",
  dateInFormatMDY:
    'Por favor ingrese una fecha vГЎlida, utulizando el formato DD/MM/YYYY (p.e. "31/12/1999")',
  email:
    'Por favor, ingrese una direcciГіn de e-mail vГЎlida. Por ejemplo, "fred@dominio.com".',
  url: "Por favor ingrese una URL vГЎlida como http://www.example.com.",
  currencyDollar:
    "Por favor ingrese una cantidad vГЎlida de pesos. Por ejemplo $100,00 .",
  oneRequired:
    "Por favor ingrese algo para por lo menos una de estas entradas.",
  errorPrefix: "Error: ",
  warningPrefix: "Advertencia: ",
  noSpace: "No se permiten espacios en este campo.",
  reqChkByNode: "No hay elementos seleccionados.",
  requiredChk: "Este campo es obligatorio.",
  reqChkByName: "Por favor selecciona una {label}.",
  match: "Este campo necesita coincidir con el campo {matchName}",
  startDate: "la fecha de inicio",
  endDate: "la fecha de fin",
  currendDate: "la fecha actual",
  afterDate: "La fecha debe ser igual o posterior a {label}.",
  beforeDate: "La fecha debe ser igual o anterior a {label}.",
  startMonth: "Por favor selecciona un mes de origen",
  sameMonth:
    "Estas dos fechas deben estar en el mismo mes - debes cambiar una u otra.",
});
Locale.define("es-ES", "FormValidator", {
  required: "Este campo es obligatorio.",
  minLength:
    "Por favor introduce al menos {minLength} caracteres (has introducido {length} caracteres).",
  maxLength:
    "Por favor introduce no m&aacute;s de {maxLength} caracteres (has introducido {length} caracteres).",
  integer:
    "Por favor introduce un n&uacute;mero entero en este campo. N&uacute;meros con decimales (p.e. 1,25) no se permiten.",
  numeric:
    'Por favor introduce solo valores num&eacute;ricos en este campo (p.e. "1" o "1,1" o "-1" o "-1,1").',
  digits:
    "Por favor usa solo n&uacute;meros y puntuaci&oacute;n en este campo (por ejemplo, un n&uacute;mero de tel&eacute;fono con guiones y puntos no esta permitido).",
  alpha:
    "Por favor usa letras solo (a-z) en este campo. No se admiten espacios ni otros caracteres.",
  alphanum:
    "Por favor, usa solo letras (a-z) o n&uacute;meros (0-9) en este campo. No se admiten espacios ni otros caracteres.",
  dateSuchAs: "Por favor introduce una fecha v&aacute;lida como {date}",
  dateInFormatMDY:
    'Por favor introduce una fecha v&aacute;lida como DD/MM/YYYY (p.e. "31/12/1999")',
  email:
    'Por favor, introduce una direcci&oacute;n de email v&aacute;lida. Por ejemplo, "fred@domain.com".',
  url: "Por favor introduce una URL v&aacute;lida como http://www.example.com.",
  currencyDollar:
    "Por favor introduce una cantidad v&aacute;lida de в‚¬. Por ejemplo в‚¬100,00 .",
  oneRequired:
    "Por favor introduce algo para por lo menos una de estas entradas.",
  errorPrefix: "Error: ",
  warningPrefix: "Aviso: ",
  noSpace: "No pueden haber espacios en esta entrada.",
  reqChkByNode: "No hay elementos seleccionados.",
  requiredChk: "Este campo es obligatorio.",
  reqChkByName: "Por favor selecciona una {label}.",
  match: "Este campo necesita coincidir con el campo {matchName}",
  startDate: "la fecha de inicio",
  endDate: "la fecha de fin",
  currendDate: "la fecha actual",
  afterDate: "La fecha debe ser igual o posterior a {label}.",
  beforeDate: "La fecha debe ser igual o anterior a {label}.",
  startMonth: "Por favor selecciona un mes de origen",
  sameMonth:
    "Estas dos fechas deben estar en el mismo mes - debes cambiar una u otra.",
});
Locale.define("et-EE", "Date", {
  months: [
    "jaanuar",
    "veebruar",
    "mГ¤rts",
    "aprill",
    "mai",
    "juuni",
    "juuli",
    "august",
    "september",
    "oktoober",
    "november",
    "detsember",
  ],
  months_abbr: [
    "jaan",
    "veebr",
    "mГ¤rts",
    "apr",
    "mai",
    "juuni",
    "juuli",
    "aug",
    "sept",
    "okt",
    "nov",
    "dets",
  ],
  days: [
    "pГјhapГ¤ev",
    "esmaspГ¤ev",
    "teisipГ¤ev",
    "kolmapГ¤ev",
    "neljapГ¤ev",
    "reede",
    "laupГ¤ev",
  ],
  days_abbr: [
    "pГјhap",
    "esmasp",
    "teisip",
    "kolmap",
    "neljap",
    "reede",
    "laup",
  ],
  dateOrder: ["month", "date", "year"],
  shortDate: "%m.%d.%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "",
  lessThanMinuteAgo: "vГ¤hem kui minut aega tagasi",
  minuteAgo: "umbes minut aega tagasi",
  minutesAgo: "{delta} minutit tagasi",
  hourAgo: "umbes tund aega tagasi",
  hoursAgo: "umbes {delta} tundi tagasi",
  dayAgo: "1 pГ¤ev tagasi",
  daysAgo: "{delta} pГ¤eva tagasi",
  weekAgo: "1 nГ¤dal tagasi",
  weeksAgo: "{delta} nГ¤dalat tagasi",
  monthAgo: "1 kuu tagasi",
  monthsAgo: "{delta} kuud tagasi",
  yearAgo: "1 aasta tagasi",
  yearsAgo: "{delta} aastat tagasi",
  lessThanMinuteUntil: "vГ¤hem kui minuti aja pГ¤rast",
  minuteUntil: "umbes minuti aja pГ¤rast",
  minutesUntil: "{delta} minuti pГ¤rast",
  hourUntil: "umbes tunni aja pГ¤rast",
  hoursUntil: "umbes {delta} tunni pГ¤rast",
  dayUntil: "1 pГ¤eva pГ¤rast",
  daysUntil: "{delta} pГ¤eva pГ¤rast",
  weekUntil: "1 nГ¤dala pГ¤rast",
  weeksUntil: "{delta} nГ¤dala pГ¤rast",
  monthUntil: "1 kuu pГ¤rast",
  monthsUntil: "{delta} kuu pГ¤rast",
  yearUntil: "1 aasta pГ¤rast",
  yearsUntil: "{delta} aasta pГ¤rast",
});
Locale.define("et-EE", "FormValidator", {
  required: "VГ¤li peab olema tГ¤idetud.",
  minLength:
    "Palun sisestage vГ¤hemalt {minLength} tГ¤hte (te sisestasite {length} tГ¤hte).",
  maxLength:
    "Palun Г¤rge sisestage rohkem kui {maxLength} tГ¤hte (te sisestasite {length} tГ¤hte).",
  integer:
    "Palun sisestage vГ¤ljale tГ¤isarv. KГјmnendarvud (nГ¤iteks 1.25) ei ole lubatud.",
  numeric:
    'Palun sisestage ainult numbreid vГ¤ljale (nГ¤iteks "1", "1.1", "-1" vГµi "-1.1").',
  digits:
    "Palun kasutage ainult numbreid ja kirjavahemГ¤rke (telefoninumbri sisestamisel on lubatud kasutada kriipse ja punkte).",
  alpha:
    "Palun kasutage ainult tГ¤hti (a-z). TГјhikud ja teised sГјmbolid on keelatud.",
  alphanum:
    "Palun kasutage ainult tГ¤hti (a-z) vГµi numbreid (0-9). TГјhikud ja teised sГјmbolid on keelatud.",
  dateSuchAs: "Palun sisestage kehtiv kuupГ¤ev kujul {date}",
  dateInFormatMDY:
    'Palun sisestage kehtiv kuupГ¤ev kujul MM.DD.YYYY (nГ¤iteks: "12.31.1999").',
  email:
    'Palun sisestage kehtiv e-maili aadress (nГ¤iteks: "fred@domain.com").',
  url: "Palun sisestage kehtiv URL (nГ¤iteks: http://www.example.com).",
  currencyDollar: "Palun sisestage kehtiv $ summa (nГ¤iteks: $100.00).",
  oneRequired: "Palun sisestage midagi vГ¤hemalt Гјhele antud vГ¤ljadest.",
  errorPrefix: "Viga: ",
  warningPrefix: "Hoiatus: ",
  noSpace: "VГ¤li ei tohi sisaldada tГјhikuid.",
  reqChkByNode: "Гњkski vГ¤ljadest pole valitud.",
  requiredChk: "VГ¤lja tГ¤itmine on vajalik.",
  reqChkByName: "Palun valige Гјks {label}.",
  match: "VГ¤li peab sobima {matchName} vГ¤ljaga",
  startDate: "algkuupГ¤ev",
  endDate: "lГµppkuupГ¤ev",
  currendDate: "praegune kuupГ¤ev",
  afterDate: "KuupГ¤ev peab olema vГµrdne vГµi pГ¤rast {label}.",
  beforeDate: "KuupГ¤ev peab olema vГµrdne vГµi enne {label}.",
  startMonth: "Palun valige algkuupГ¤ev.",
  sameMonth:
    "Antud kaks kuupГ¤eva peavad olema samas kuus - peate muutma Гјhte kuupГ¤eva.",
});
Locale.define("fa", "Date", {
  months: [
    "ЪШ§Щ†Щ€ЫЊЩ‡",
    "ЩЃЩ€Ш±ЫЊЩ‡",
    "Щ…Ш§Ш±Ші",
    "ШўЩѕШ±ЫЊЩ„",
    "Щ…Щ‡",
    "ЪЩ€Ш¦Щ†",
    "ЪЩ€Ш¦ЫЊЩ‡",
    "ШўЪЇЩ€ШіШЄ",
    "ШіЩѕШЄШ§Щ…ШЁШ±",
    "Ш§Ъ©ШЄШЁШ±",
    "Щ†Щ€Ш§Щ…ШЁШ±",
    "ШЇШіШ§Щ…ШЁШ±",
  ],
  months_abbr: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
  days: [
    "ЫЊЪ©ШґЩ†ШЁЩ‡",
    "ШЇЩ€ШґЩ†ШЁЩ‡",
    "ШіЩ‡ ШґЩ†ШЁЩ‡",
    "Ъ†Щ‡Ш§Ш±ШґЩ†ШЁЩ‡",
    "ЩѕЩ†Ш¬ШґЩ†ШЁЩ‡",
    "Ш¬Щ…Ш№Щ‡",
    "ШґЩ†ШЁЩ‡",
  ],
  days_abbr: ["ЩЉ", "ШЇ", "Ші", "Ъ†", "Щѕ", "Ш¬", "Шґ"],
  dateOrder: ["month", "date", "year"],
  shortDate: "%m/%d/%Y",
  shortTime: "%I:%M%p",
  AM: "Щ‚.Шё",
  PM: "ШЁ.Шё",
  ordinal: "Ш§Щ…",
  lessThanMinuteAgo: "Ъ©Щ…ШЄШ± Ш§ШІ ЫЊЪ© ШЇЩ‚ЫЊЩ‚Щ‡ ЩѕЫЊШґ",
  minuteAgo: "Ш­ШЇЩ€ШЇ ЫЊЪ© ШЇЩ‚ЫЊЩ‚Щ‡ ЩѕЫЊШґ",
  minutesAgo: "{delta} ШЇЩ‚ЫЊЩ‚Щ‡ ЩѕЫЊШґ",
  hourAgo: "Ш­ШЇЩ€ШЇ ЫЊЪ© ШіШ§Ш№ШЄ ЩѕЫЊШґ",
  hoursAgo: "Ш­ШЇЩ€ШЇ {delta} ШіШ§Ш№ШЄ ЩѕЫЊШґ",
  dayAgo: "1 Ш±Щ€ШІ ЩѕЫЊШґ",
  daysAgo: "{delta} Ш±Щ€ШІ ЩѕЫЊШґ",
  weekAgo: "1 Щ‡ЩЃШЄЩ‡ ЩѕЫЊШґ",
  weeksAgo: "{delta} Щ‡ЩЃШЄЩ‡ ЩѕЫЊШґ",
  monthAgo: "1 Щ…Ш§Щ‡ ЩѕЫЊШґ",
  monthsAgo: "{delta} Щ…Ш§Щ‡ ЩѕЫЊШґ",
  yearAgo: "1 ШіШ§Щ„ ЩѕЫЊШґ",
  yearsAgo: "{delta} ШіШ§Щ„ ЩѕЫЊШґ",
  lessThanMinuteUntil: "Ъ©Щ…ШЄШ± Ш§ШІ ЫЊЪ© ШЇЩ‚ЫЊЩ‚Щ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  minuteUntil: "Ш­ШЇЩ€ШЇ ЫЊЪ© ШЇЩ‚ЫЊЩ‚Щ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  minutesUntil: "{delta} ШЇЩ‚ЫЊЩ‚Щ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  hourUntil: "Ш­ШЇЩ€ШЇ ЫЊЪ© ШіШ§Ш№ШЄ Ш§ШІ Ш­Ш§Щ„Ш§",
  hoursUntil: "Ш­ШЇЩ€ШЇ {delta} ШіШ§Ш№ШЄ Ш§ШІ Ш­Ш§Щ„Ш§",
  dayUntil: "1 Ш±Щ€ШІ Ш§ШІ Ш­Ш§Щ„Ш§",
  daysUntil: "{delta} Ш±Щ€ШІ Ш§ШІ Ш­Ш§Щ„Ш§",
  weekUntil: "1 Щ‡ЩЃШЄЩ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  weeksUntil: "{delta} Щ‡ЩЃШЄЩ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  monthUntil: "1 Щ…Ш§Щ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  monthsUntil: "{delta} Щ…Ш§Щ‡ Ш§ШІ Ш­Ш§Щ„Ш§",
  yearUntil: "1 ШіШ§Щ„ Ш§ШІ Ш­Ш§Щ„Ш§",
  yearsUntil: "{delta} ШіШ§Щ„ Ш§ШІ Ш­Ш§Щ„Ш§",
});
Locale.define("fa", "FormValidator", {
  required: "Ш§ЫЊЩ† ЩЃЫЊЩ„ШЇ Ш§Щ„ШІШ§Щ…ЫЊ Ш§ШіШЄ.",
  minLength:
    "ШґЩ…Ш§ ШЁШ§ЫЊШЇ Ш­ШЇШ§Щ‚Щ„ {minLength} Ш­Ш±ЩЃ Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ ({length} Ш­Ш±ЩЃ Щ€Ш§Ш±ШЇ Ъ©Ш±ШЇЩ‡ Ш§ЫЊШЇ).",
  maxLength:
    "Щ„Ш·ЩЃШ§ Ш­ШЇШ§Ъ©Ш«Ш± {maxLength} Ш­Ш±ЩЃ Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ (ШґЩ…Ш§ {length} Ш­Ш±ЩЃ Щ€Ш§Ш±ШЇ Ъ©Ш±ШЇЩ‡ Ш§ЫЊШЇ).",
  integer:
    "Щ„Ш·ЩЃШ§ Ш§ШІ Ш№ШЇШЇ ШµШ­ЫЊШ­ Ш§ШіШЄЩЃШ§ШЇЩ‡ Ъ©Щ†ЫЊШЇ. Ш§Ш№ШЇШ§ШЇ Ш§Ш№ШґШ§Ш±ЫЊ (Щ…Ш§Щ†Щ†ШЇ 1.25) Щ…Ш¬Ш§ШІ Щ†ЫЊШіШЄЩ†ШЇ.",
  numeric:
    'Щ„Ш·ЩЃШ§ ЩЃЩ‚Ш· ШЇШ§ШЇЩ‡ Ш№ШЇШЇЫЊ Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ (Щ…Ш§Щ†Щ†ШЇ "1" ЫЊШ§ "1.1" ЫЊШ§ "1-" ЫЊШ§ "1.1-").',
  digits:
    "Щ„Ш·ЩЃШ§ ЩЃЩ‚Ш· Ш§ШІ Ш§Ш№ШЇШ§ШЇ Щ€ Ш№Щ„Ш§Щ…ШЄЩ‡Ш§ ШЇШ± Ш§ЫЊЩ† ЩЃЫЊЩ„ШЇ Ш§ШіШЄЩЃШ§ШЇЩ‡ Ъ©Щ†ЫЊШЇ (ШЁШ±Ш§ЫЊ Щ…Ш«Ш§Щ„ ШґЩ…Ш§Ш±Щ‡ ШЄЩ„ЩЃЩ† ШЁШ§ Ш®Ш· ШЄЫЊШ±Щ‡ Щ€ Щ†Щ‚Ш·Щ‡ Щ‚Ш§ШЁЩ„ Щ‚ШЁЩ€Щ„ Ш§ШіШЄ).",
  alpha:
    "Щ„Ш·ЩЃШ§ ЩЃЩ‚Ш· Ш§ШІ Ш­Ш±Щ€ЩЃ Ш§Щ„ЩЃШЁШ§ШЎ ШЁШ±Ш§ЫЊ Ш§ЫЊЩ† ШЁШ®Шґ Ш§ШіШЄЩЃШ§ШЇЩ‡ Ъ©Щ†ЫЊШЇ. Ъ©Ш§Ш±Ш§Ъ©ШЄШ±Щ‡Ш§ЫЊ ШЇЫЊЪЇШ± Щ€ ЩЃШ§ШµЩ„Щ‡ Щ…Ш¬Ш§ШІ Щ†ЫЊШіШЄЩ†ШЇ.",
  alphanum:
    "Щ„Ш·ЩЃШ§ ЩЃЩ‚Ш· Ш§ШІ Ш­Ш±Щ€ЩЃ Ш§Щ„ЩЃШЁШ§ШЎ Щ€ Ш§Ш№ШЇШ§ШЇ ШЇШ± Ш§ЫЊЩ† ШЁШ®Шґ Ш§ШіШЄЩЃШ§ШЇЩ‡ Ъ©Щ†ЫЊШЇ. Ъ©Ш§Ш±Ш§Ъ©ШЄШ±Щ‡Ш§ЫЊ ШЇЫЊЪЇШ± Щ€ ЩЃШ§ШµЩ„Щ‡ Щ…Ш¬Ш§ШІ Щ†ЫЊШіШЄЩ†ШЇ.",
  dateSuchAs:
    "Щ„Ш·ЩЃШ§ ЫЊЪ© ШЄШ§Ш±ЫЊШ® Щ…Ш№ШЄШЁШ± Щ…Ш§Щ†Щ†ШЇ {date} Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ.",
  dateInFormatMDY:
    'Щ„Ш·ЩЃШ§ ЫЊЪ© ШЄШ§Ш±ЫЊШ® Щ…Ш№ШЄШЁШ± ШЁЩ‡ ШґЪ©Щ„ MM/DD/YYYY Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ (Щ…Ш§Щ†Щ†ШЇ "12/31/1999").',
  email:
    'Щ„Ш·ЩЃШ§ ЫЊЪ© ШўШЇШ±Ші Ш§ЫЊЩ…ЫЊЩ„ Щ…Ш№ШЄШЁШ± Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ. ШЁШ±Ш§ЫЊ Щ…Ш«Ш§Щ„ "fred@domain.com".',
  url: "Щ„Ш·ЩЃШ§ ЫЊЪ© URL Щ…Ш№ШЄШЁШ± Щ…Ш§Щ†Щ†ШЇ http://www.example.com Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ.",
  currencyDollar:
    "Щ„Ш·ЩЃШ§ ЫЊЪ© Щ…Ш­ШЇЩ€ШЇЩ‡ Щ…Ш№ШЄШЁШ± ШЁШ±Ш§ЫЊ Ш§ЫЊЩ† ШЁШ®Шґ Щ€Ш§Ш±ШЇ Ъ©Щ†ЫЊШЇ Щ…Ш§Щ†Щ†ШЇ 100.00$ .",
  oneRequired:
    "Щ„Ш·ЩЃШ§ Ш­ШЇШ§Щ‚Щ„ ЫЊЪ©ЫЊ Ш§ШІ ЩЃЫЊЩ„ШЇЩ‡Ш§ Ш±Ш§ ЩѕШ± Ъ©Щ†ЫЊШЇ.",
  errorPrefix: "Ш®Ш·Ш§: ",
  warningPrefix: "Щ‡ШґШЇШ§Ш±: ",
  noSpace:
    "Ш§ШіШЄЩЃШ§ШЇЩ‡ Ш§ШІ ЩЃШ§ШµЩ„Щ‡ ШЇШ± Ш§ЫЊЩ† ШЁШ®Шґ Щ…Ш¬Ш§ШІ Щ†ЫЊШіШЄ.",
  reqChkByNode: "Щ…Щ€Ш±ШЇЫЊ Ш§Щ†ШЄШ®Ш§ШЁ Щ†ШґШЇЩ‡ Ш§ШіШЄ.",
  requiredChk: "Ш§ЫЊЩ† ЩЃЫЊЩ„ШЇ Ш§Щ„ШІШ§Щ…ЫЊ Ш§ШіШЄ.",
  reqChkByName: "Щ„Ш·ЩЃШ§ ЫЊЪ© {label} Ш±Ш§ Ш§Щ†ШЄШ®Ш§ШЁ Ъ©Щ†ЫЊШЇ.",
  match:
    "Ш§ЫЊЩ† ЩЃЫЊЩ„ШЇ ШЁШ§ЫЊШЇ ШЁШ§ ЩЃЫЊЩ„ШЇ {matchName} Щ…Ш·Ш§ШЁЩ‚ШЄ ШЇШ§ШґШЄЩ‡ ШЁШ§ШґШЇ.",
  startDate: "ШЄШ§Ш±ЫЊШ® ШґШ±Щ€Ш№",
  endDate: "ШЄШ§Ш±ЫЊШ® ЩѕШ§ЫЊШ§Щ†",
  currendDate: "ШЄШ§Ш±ЫЊШ® Ъ©Щ†Щ€Щ†ЫЊ",
  afterDate:
    "ШЄШ§Ш±ЫЊШ® Щ…ЫЊШЁШ§ЫЊШіШЄ ШЁШ±Ш§ШЁШ± ЫЊШ§ ШЁШ№ШЇ Ш§ШІ {label} ШЁШ§ШґШЇ",
  beforeDate:
    "ШЄШ§Ш±ЫЊШ® Щ…ЫЊШЁШ§ЫЊШіШЄ ШЁШ±Ш§ШЁШ± ЫЊШ§ Щ‚ШЁЩ„ Ш§ШІ {label} ШЁШ§ШґШЇ",
  startMonth: "Щ„Ш·ЩЃШ§ Щ…Ш§Щ‡ ШґШ±Щ€Ш№ Ш±Ш§ Ш§Щ†ШЄШ®Ш§ШЁ Ъ©Щ†ЫЊШЇ",
  sameMonth:
    "Ш§ЫЊЩ† ШЇЩ€ ШЄШ§Ш±ЫЊШ® ШЁШ§ЫЊШЇ ШЇШ± ЫЊЪ© Щ…Ш§Щ‡ ШЁШ§ШґЩ†ШЇ - ШґЩ…Ш§ ШЁШ§ЫЊШЇ ЫЊЪ©ЫЊ ЫЊШ§ Щ‡Ш± ШЇЩ€ Ш±Ш§ ШЄШєЫЊЫЊШ± ШЇЩ‡ЫЊШЇ.",
  creditcard:
    "ШґЩ…Ш§Ш±Щ‡ Ъ©Ш§Ш±ШЄ Ш§Ш№ШЄШЁШ§Ш±ЫЊ Ъ©Щ‡ Щ€Ш§Ш±ШЇ Ъ©Ш±ШЇЩ‡ Ш§ЫЊШЇ Щ…Ш№ШЄШЁШ± Щ†ЫЊШіШЄ. Щ„Ш·ЩЃШ§ ШґЩ…Ш§Ш±Щ‡ Ш±Ш§ ШЁШ±Ш±ШіЫЊ Ъ©Щ†ЫЊШЇ Щ€ Щ…Ш¬ШЇШЇШ§ ШЄЩ„Ш§Шґ Ъ©Щ†ЫЊШЇ. {length} Ш±Щ‚Щ… Щ€Ш§Ш±ШЇ ШґШЇЩ‡ Ш§ШіШЄ.",
});
Locale.define("fi-FI", "Date", {
  months: [
    "tammikuu",
    "helmikuu",
    "maaliskuu",
    "huhtikuu",
    "toukokuu",
    "kesГ¤kuu",
    "heinГ¤kuu",
    "elokuu",
    "syyskuu",
    "lokakuu",
    "marraskuu",
    "joulukuu",
  ],
  months_abbr: [
    "tammik.",
    "helmik.",
    "maalisk.",
    "huhtik.",
    "toukok.",
    "kesГ¤k.",
    "heinГ¤k.",
    "elok.",
    "syysk.",
    "lokak.",
    "marrask.",
    "jouluk.",
  ],
  days: [
    "sunnuntai",
    "maanantai",
    "tiistai",
    "keskiviikko",
    "torstai",
    "perjantai",
    "lauantai",
  ],
  days_abbr: ["su", "ma", "ti", "ke", "to", "pe", "la"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d.%m.%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: ".",
  lessThanMinuteAgo: "vajaa minuutti sitten",
  minuteAgo: "noin minuutti sitten",
  minutesAgo: "{delta} minuuttia sitten",
  hourAgo: "noin tunti sitten",
  hoursAgo: "noin {delta} tuntia sitten",
  dayAgo: "pГ¤ivГ¤ sitten",
  daysAgo: "{delta} pГ¤ivГ¤Г¤ sitten",
  weekAgo: "viikko sitten",
  weeksAgo: "{delta} viikkoa sitten",
  monthAgo: "kuukausi sitten",
  monthsAgo: "{delta} kuukautta sitten",
  yearAgo: "vuosi sitten",
  yearsAgo: "{delta} vuotta sitten",
  lessThanMinuteUntil: "vajaan minuutin kuluttua",
  minuteUntil: "noin minuutin kuluttua",
  minutesUntil: "{delta} minuutin kuluttua",
  hourUntil: "noin tunnin kuluttua",
  hoursUntil: "noin {delta} tunnin kuluttua",
  dayUntil: "pГ¤ivГ¤n kuluttua",
  daysUntil: "{delta} pГ¤ivГ¤n kuluttua",
  weekUntil: "viikon kuluttua",
  weeksUntil: "{delta} viikon kuluttua",
  monthUntil: "kuukauden kuluttua",
  monthsUntil: "{delta} kuukauden kuluttua",
  yearUntil: "vuoden kuluttua",
  yearsUntil: "{delta} vuoden kuluttua",
});
Locale.define("fi-FI", "FormValidator", {
  required: "TГ¤mГ¤ kenttГ¤ on pakollinen.",
  minLength:
    "Ole hyvГ¤ ja anna vГ¤hintГ¤Г¤n {minLength} merkkiГ¤ (annoit {length} merkkiГ¤).",
  maxLength:
    "Г„lГ¤ anna enempГ¤Г¤ kuin {maxLength} merkkiГ¤ (annoit {length} merkkiГ¤).",
  integer:
    "Ole hyvГ¤ ja anna kokonaisluku. Luvut, joissa on desimaaleja (esim. 1.25) eivГ¤t ole sallittuja.",
  numeric:
    'Anna tГ¤hГ¤n kenttГ¤Г¤n lukuarvo (kuten "1" tai "1.1" tai "-1" tai "-1.1").',
  digits:
    "KГ¤ytГ¤ pelkГ¤stГ¤Г¤n numeroita ja vГ¤limerkkejГ¤ tГ¤ssГ¤ kentГ¤ssГ¤ (syГ¶tteet, kuten esim. puhelinnumero, jossa on vГ¤liviivoja, pilkkuja tai pisteitГ¤, kelpaa).",
  alpha:
    "Anna tГ¤hГ¤n kenttГ¤Г¤n vain kirjaimia (a-z). VГ¤lilyГ¶nnit tai muut merkit eivГ¤t ole sallittuja.",
  alphanum:
    "Anna tГ¤hГ¤n kenttГ¤Г¤n vain kirjaimia (a-z) tai numeroita (0-9). VГ¤lilyГ¶nnit tai muut merkit eivГ¤t ole sallittuja.",
  dateSuchAs:
    "Ole hyvГ¤ ja anna kelvollinen pГ¤ivmГ¤Г¤rГ¤, kuten esimerkiksi {date}",
  dateInFormatMDY:
    'Ole hyvГ¤ ja anna kelvollinen pГ¤ivГ¤mГ¤Г¤rГ¤ muodossa pp/kk/vvvv (kuten "12/31/1999")',
  email:
    'Ole hyvГ¤ ja anna kelvollinen sГ¤hkГ¶postiosoite (kuten esimerkiksi "matti@meikalainen.com").',
  url: "Ole hyvГ¤ ja anna kelvollinen URL, kuten esimerkiksi http://www.example.com.",
  currencyDollar:
    "Ole hyvГ¤ ja anna kelvollinen eurosumma (kuten esimerkiksi 100,00 EUR) .",
  oneRequired:
    "Ole hyvГ¤ ja syГ¶tГ¤ jotakin ainakin johonkin nГ¤istГ¤ kentistГ¤.",
  errorPrefix: "Virhe: ",
  warningPrefix: "Varoitus: ",
  noSpace: "TГ¤ssГ¤ syГ¶tteessГ¤ ei voi olla vГ¤lilyГ¶ntejГ¤",
  reqChkByNode: "Ei valintoja.",
  requiredChk: "TГ¤mГ¤ kenttГ¤ on pakollinen.",
  reqChkByName: "Ole hyvГ¤ ja valitse {label}.",
  match: "TГ¤mГ¤n kentГ¤n tulee vastata kenttГ¤Г¤ {matchName}",
  startDate: "alkupГ¤ivГ¤mГ¤Г¤rГ¤",
  endDate: "loppupГ¤ivГ¤mГ¤Г¤rГ¤",
  currendDate: "nykyinen pГ¤ivГ¤mГ¤Г¤rГ¤",
  afterDate:
    "PГ¤ivГ¤mГ¤Г¤rГ¤n tulisi olla sama tai myГ¶hГ¤isempi ajankohta kuin {label}.",
  beforeDate:
    "PГ¤ivГ¤mГ¤Г¤rГ¤n tulisi olla sama tai aikaisempi ajankohta kuin {label}.",
  startMonth: "Ole hyvГ¤ ja valitse aloituskuukausi",
  sameMonth:
    "NГ¤iden kahden pГ¤ivГ¤mГ¤Г¤rГ¤n tulee olla saman kuun sisГ¤llГ¤ -- sinun pitГ¤Г¤ muuttaa jompaa kumpaa.",
  creditcard:
    "Annettu luottokortin numero ei kelpaa. Ole hyvГ¤ ja tarkista numero sekГ¤ yritГ¤ uudelleen. {length} numeroa syГ¶tetty.",
});
Locale.define("fi-FI", "Number", { group: " " }).inherit("EU", "Number");
Locale.define("fr-FR", "Date", {
  months: [
    "Janvier",
    "FГ©vrier",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "AoГ»t",
    "Septembre",
    "Octobre",
    "Novembre",
    "DГ©cembre",
  ],
  months_abbr: [
    "janv.",
    "fГ©vr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "aoГ»t",
    "sept.",
    "oct.",
    "nov.",
    "dГ©c.",
  ],
  days: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi",
  ],
  days_abbr: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: function (a) {
    return a > 1 ? "" : "er";
  },
  lessThanMinuteAgo: "il y a moins d'une minute",
  minuteAgo: "il y a une minute",
  minutesAgo: "il y a {delta} minutes",
  hourAgo: "il y a une heure",
  hoursAgo: "il y a {delta} heures",
  dayAgo: "il y a un jour",
  daysAgo: "il y a {delta} jours",
  weekAgo: "il y a une semaine",
  weeksAgo: "il y a {delta} semaines",
  monthAgo: "il y a 1 mois",
  monthsAgo: "il y a {delta} mois",
  yearthAgo: "il y a 1 an",
  yearsAgo: "il y a {delta} ans",
  lessThanMinuteUntil: "dans moins d'une minute",
  minuteUntil: "dans une minute",
  minutesUntil: "dans {delta} minutes",
  hourUntil: "dans une heure",
  hoursUntil: "dans {delta} heures",
  dayUntil: "dans un jour",
  daysUntil: "dans {delta} jours",
  weekUntil: "dans 1 semaine",
  weeksUntil: "dans {delta} semaines",
  monthUntil: "dans 1 mois",
  monthsUntil: "dans {delta} mois",
  yearUntil: "dans 1 an",
  yearsUntil: "dans {delta} ans",
});
Locale.define("fr-FR", "FormValidator", {
  required: "Ce champ est obligatoire.",
  length:
    "Veuillez saisir {length} caract&egrave;re(s) (vous avez saisi {elLength} caract&egrave;re(s)",
  minLength:
    "Veuillez saisir un minimum de {minLength} caract&egrave;re(s) (vous avez saisi {length} caract&egrave;re(s)).",
  maxLength:
    "Veuillez saisir un maximum de {maxLength} caract&egrave;re(s) (vous avez saisi {length} caract&egrave;re(s)).",
  integer:
    'Veuillez saisir un nombre entier dans ce champ. Les nombres d&eacute;cimaux (ex : "1,25") ne sont pas autoris&eacute;s.',
  numeric:
    'Veuillez saisir uniquement des chiffres dans ce champ (ex : "1" ou "1,1" ou "-1" ou "-1,1").',
  digits:
    "Veuillez saisir uniquement des chiffres et des signes de ponctuation dans ce champ (ex : un num&eacute;ro de t&eacute;l&eacute;phone avec des traits d'union est autoris&eacute;).",
  alpha:
    "Veuillez saisir uniquement des lettres (a-z) dans ce champ. Les espaces ou autres caract&egrave;res ne sont pas autoris&eacute;s.",
  alphanum:
    "Veuillez saisir uniquement des lettres (a-z) ou des chiffres (0-9) dans ce champ. Les espaces ou autres caract&egrave;res ne sont pas autoris&eacute;s.",
  dateSuchAs: "Veuillez saisir une date correcte comme {date}",
  dateInFormatMDY:
    'Veuillez saisir une date correcte, au format JJ/MM/AAAA (ex : "31/11/1999").',
  email:
    'Veuillez saisir une adresse de courrier &eacute;lectronique. Par example "fred@domaine.com".',
  url: "Veuillez saisir une URL, comme http://www.example.com.",
  currencyDollar:
    "Veuillez saisir une quantit&eacute; correcte. Par example 100,00&euro;.",
  oneRequired: "Veuillez s&eacute;lectionner au moins une de ces options.",
  errorPrefix: "Erreur : ",
  warningPrefix: "Attention : ",
  noSpace: "Ce champ n'accepte pas les espaces.",
  reqChkByNode: "Aucun &eacute;l&eacute;ment n'est s&eacute;lectionn&eacute;.",
  requiredChk: "Ce champ est obligatoire.",
  reqChkByName: "Veuillez s&eacute;lectionner un(e) {label}.",
  match: "Ce champ doit correspondre avec le champ {matchName}.",
  startDate: "date de d&eacute;but",
  endDate: "date de fin",
  currendDate: "date actuelle",
  afterDate:
    "La date doit &ecirc;tre identique ou post&eacute;rieure &agrave; {label}.",
  beforeDate:
    "La date doit &ecirc;tre identique ou ant&eacute;rieure &agrave; {label}.",
  startMonth: "Veuillez s&eacute;lectionner un mois de d&eacute;but.",
  sameMonth:
    "Ces deux dates doivent &ecirc;tre dans le m&ecirc;me mois - vous devez en modifier une.",
  creditcard:
    "Le num&eacute;ro de carte de cr&eacute;dit est invalide. Merci de v&eacute;rifier le num&eacute;ro et de r&eacute;essayer. Vous avez entr&eacute; {length} chiffre(s).",
});
Locale.define("fr-FR", "Number", { group: " " }).inherit("EU", "Number");
Locale.define("he-IL", "Date", {
  months: [
    "Ч™Ч Ч•ЧђЧЁ",
    "Ч¤Ч‘ЧЁЧ•ЧђЧЁ",
    "ЧћЧЁЧҐ",
    "ЧђЧ¤ЧЁЧ™Чњ",
    "ЧћЧђЧ™",
    "Ч™Ч•Ч Ч™",
    "Ч™Ч•ЧњЧ™",
    "ЧђЧ•Ч’Ч•ЧЎЧ",
    "ЧЎЧ¤ЧЧћЧ‘ЧЁ",
    "ЧђЧ•Ч§ЧЧ•Ч‘ЧЁ",
    "Ч Ч•Ч‘ЧћЧ‘ЧЁ",
    "Ч“Ч¦ЧћЧ‘ЧЁ",
  ],
  months_abbr: [
    "Ч™Ч Ч•ЧђЧЁ",
    "Ч¤Ч‘ЧЁЧ•ЧђЧЁ",
    "ЧћЧЁЧҐ",
    "ЧђЧ¤ЧЁЧ™Чњ",
    "ЧћЧђЧ™",
    "Ч™Ч•Ч Ч™",
    "Ч™Ч•ЧњЧ™",
    "ЧђЧ•Ч’Ч•ЧЎЧ",
    "ЧЎЧ¤ЧЧћЧ‘ЧЁ",
    "ЧђЧ•Ч§ЧЧ•Ч‘ЧЁ",
    "Ч Ч•Ч‘ЧћЧ‘ЧЁ",
    "Ч“Ч¦ЧћЧ‘ЧЁ",
  ],
  days: [
    "ЧЁЧђЧ©Ч•Чџ",
    "Ч©Ч Ч™",
    "Ч©ЧњЧ™Ч©Ч™",
    "ЧЁЧ‘Ч™ЧўЧ™",
    "Ч—ЧћЧ™Ч©Ч™",
    "Ч©Ч™Ч©Ч™",
    "Ч©Ч‘ЧЄ",
  ],
  days_abbr: [
    "ЧЁЧђЧ©Ч•Чџ",
    "Ч©Ч Ч™",
    "Ч©ЧњЧ™Ч©Ч™",
    "ЧЁЧ‘Ч™ЧўЧ™",
    "Ч—ЧћЧ™Ч©Ч™",
    "Ч©Ч™Ч©Ч™",
    "Ч©Ч‘ЧЄ",
  ],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 0,
  ordinal: "",
  lessThanMinuteAgo: "ЧњЧ¤Ч Ч™ Ч¤Ч—Ч•ЧЄ ЧћЧ“Ч§Ч”",
  minuteAgo: "ЧњЧ¤Ч Ч™ Ч›Ч“Ч§Ч”",
  minutesAgo: "ЧњЧ¤Ч Ч™ {delta} Ч“Ч§Ч•ЧЄ",
  hourAgo: "ЧњЧ¤Ч Ч™ Ч›Ч©ЧўЧ”",
  hoursAgo: "ЧњЧ¤Ч Ч™ {delta} Ч©ЧўЧ•ЧЄ",
  dayAgo: "ЧњЧ¤Ч Ч™ Ч™Ч•Чќ",
  daysAgo: "ЧњЧ¤Ч Ч™ {delta} Ч™ЧћЧ™Чќ",
  weekAgo: "ЧњЧ¤Ч Ч™ Ч©Ч‘Ч•Чў",
  weeksAgo: "ЧњЧ¤Ч Ч™ {delta} Ч©Ч‘Ч•ЧўЧ•ЧЄ",
  monthAgo: "ЧњЧ¤Ч Ч™ Ч—Ч•Ч“Ч©",
  monthsAgo: "ЧњЧ¤Ч Ч™ {delta} Ч—Ч•Ч“Ч©Ч™Чќ",
  yearAgo: "ЧњЧ¤Ч Ч™ Ч©Ч Ч”",
  yearsAgo: "ЧњЧ¤Ч Ч™ {delta} Ч©Ч Ч™Чќ",
  lessThanMinuteUntil: "Ч‘ЧўЧ•Ч“ Ч¤Ч—Ч•ЧЄ ЧћЧ“Ч§Ч”",
  minuteUntil: "Ч‘ЧўЧ•Ч“ Ч›Ч“Ч§Ч”",
  minutesUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч“Ч§Ч•ЧЄ",
  hourUntil: "Ч‘ЧўЧ•Ч“ Ч›Ч©ЧўЧ”",
  hoursUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч©ЧўЧ•ЧЄ",
  dayUntil: "Ч‘ЧўЧ•Ч“ Ч™Ч•Чќ",
  daysUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч™ЧћЧ™Чќ",
  weekUntil: "Ч‘ЧўЧ•Ч“ Ч©Ч‘Ч•Чў",
  weeksUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч©Ч‘Ч•ЧўЧ•ЧЄ",
  monthUntil: "Ч‘ЧўЧ•Ч“ Ч—Ч•Ч“Ч©",
  monthsUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч—Ч•Ч“Ч©Ч™Чќ",
  yearUntil: "Ч‘ЧўЧ•Ч“ Ч©Ч Ч”",
  yearsUntil: "Ч‘ЧўЧ•Ч“ {delta} Ч©Ч Ч™Чќ",
});
Locale.define("he-IL", "FormValidator", {
  required: "Ч Чђ ЧњЧћЧњЧђ Ч©Ч“Ч” Ч–Ч”.",
  minLength:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧњЧ¤Ч—Ч•ЧЄ {minLength} ЧЄЧ•Ч•Ч™Чќ (Ч”Ч–Ч ЧЄ {length} ЧЄЧ•Ч•Ч™Чќ).",
  maxLength:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧўЧ“ {maxLength} ЧЄЧ•Ч•Ч™Чќ (Ч”Ч–Ч ЧЄ {length} ЧЄЧ•Ч•Ч™Чќ).",
  integer:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧћЧЎЧ¤ЧЁ Ч©ЧњЧќ ЧњЧ©Ч“Ч” Ч–Ч”. ЧћЧЎЧ¤ЧЁЧ™Чќ ЧўЧ©ЧЁЧ•Ч Ч™Ч™Чќ (Ч›ЧћЧ• 1.25) ЧђЧ™Ч Чќ Ч—Ч•Ч§Ч™Ч™Чќ.",
  numeric:
    'Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧўЧЁЧљ ЧћЧЎЧ¤ЧЁЧ™ Ч‘ЧњЧ‘Ч“ Ч‘Ч©Ч“Ч” Ч–Ч” (Ч›ЧћЧ• "1", "1.1", "-1" ЧђЧ• "-1.1").',
  digits:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЁЧ§ ЧЎЧ¤ЧЁЧ•ЧЄ Ч•ЧЎЧ™ЧћЧ Ч™ Ч”Ч¤ЧЁЧ“Ч” Ч‘Ч©Ч“Ч” Ч–Ч” (ЧњЧћЧ©Чњ, ЧћЧЎЧ¤ЧЁ ЧЧњЧ¤Ч•Чџ ЧўЧќ ЧћЧ§Ч¤Ч™Чќ ЧђЧ• Ч Ч§Ч•Ч“Ч•ЧЄ Ч”Ч•Чђ Ч—Ч•Ч§Ч™).",
  alpha:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЁЧ§ ЧђЧ•ЧЄЧ™Ч•ЧЄ Ч‘ЧђЧ Ч’ЧњЧ™ЧЄ (a-z) Ч‘Ч©Ч“Ч” Ч–Ч”. ЧЁЧ•Ч•Ч—Ч™Чќ ЧђЧ• ЧЄЧ•Ч•Ч™Чќ ЧђЧ—ЧЁЧ™Чќ ЧђЧ™Ч Чќ Ч—Ч•Ч§Ч™Ч™Чќ.",
  alphanum:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЁЧ§ ЧђЧ•ЧЄЧЁЧ™Ч•ЧЄ Ч‘ЧђЧ Ч’ЧњЧ™ЧЄ (a-z) ЧђЧ• ЧЎЧ¤ЧЁЧ•ЧЄ (0-9) Ч‘Ч©Ч“Ч” Ч–Ч”. ЧђЧ•Ч•Ч—ЧЁЧ™Чќ ЧђЧ• ЧЄЧ•Ч•Ч™Чќ ЧђЧ—ЧЁЧ™Чќ ЧђЧ™Ч Чќ Ч—Ч•Ч§Ч™Ч™Чќ.",
  dateSuchAs: "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЄЧђЧЁЧ™Чљ Ч—Ч•Ч§Ч™, Ч›ЧћЧ• {date}",
  dateInFormatMDY:
    'Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЄЧђЧЁЧ™Чљ Ч—Ч•Ч§Ч™ Ч‘Ч¤Ч•ЧЁЧћЧ MM/DD/YYYY (Ч›ЧћЧ• "12/31/1999")',
  email:
    'Ч Чђ ЧњЧ”Ч–Ч™Чџ Ч›ЧЄЧ•Ч‘ЧЄ ЧђЧ™ЧћЧ™Ч™Чњ Ч—Ч•Ч§Ч™ЧЄ. ЧњЧ“Ч•Ч’ЧћЧ”: "fred@domain.com".',
  url: "Ч Чђ ЧњЧ”Ч–Ч™Чџ Ч›ЧЄЧ•Ч‘ЧЄ ЧђЧЄЧЁ Ч—Ч•Ч§Ч™ЧЄ, Ч›ЧћЧ• http://www.example.com.",
  currencyDollar:
    "Ч Чђ ЧњЧ”Ч–Ч™Чџ ЧЎЧ›Ч•Чќ Ч“Ч•ЧњЧЁЧ™ Ч—Ч•Ч§Ч™. ЧњЧ“Ч•Ч’ЧћЧ” $100.00.",
  oneRequired: "Ч Чђ ЧњЧ‘Ч—Ч•ЧЁ ЧњЧ¤Ч—Ч•ЧЄ Ч‘Ч©Ч“Ч” ЧђЧ—Ч“.",
  errorPrefix: "Ч©Ч’Ч™ЧђЧ”: ",
  warningPrefix: "ЧђЧ–Ч”ЧЁЧ”: ",
  noSpace: "ЧђЧ™Чџ ЧњЧ”Ч–Ч™Чџ ЧЁЧ•Ч•Ч—Ч™Чќ Ч‘Ч©Ч“Ч” Ч–Ч”.",
  reqChkByNode: "Ч Чђ ЧњЧ‘Ч—Ч•ЧЁ ЧђЧ—ЧЄ ЧћЧ”ЧђЧ¤Ч©ЧЁЧ•Ч™Ч•ЧЄ.",
  requiredChk: "Ч©Ч“Ч” Ч–Ч” Ч Ч“ЧЁЧ©.",
  reqChkByName: "Ч Чђ ЧњЧ‘Ч—Ч•ЧЁ {label}.",
  match: "Ч©Ч“Ч” Ч–Ч” Ч¦ЧЁЧ™Чљ ЧњЧ”ЧЄЧђЧ™Чќ ЧњЧ©Ч“Ч” {matchName}",
  startDate: "ЧЄЧђЧЁЧ™Чљ Ч”Ч”ЧЄЧ—ЧњЧ”",
  endDate: "ЧЄЧђЧЁЧ™Чљ Ч”ЧЎЧ™Ч•Чќ",
  currendDate: "Ч”ЧЄЧђЧЁЧ™Чљ Ч”Ч Ч•Ч›Ч—Ч™",
  afterDate: "Ч”ЧЄЧђЧЁЧ™Чљ Ч¦ЧЁЧ™Чљ ЧњЧ”Ч™Ч•ЧЄ Ч–Ч”Ч” ЧђЧ• ЧђЧ—ЧЁЧ™ {label}.",
  beforeDate: "Ч”ЧЄЧђЧЁЧ™Чљ Ч¦ЧЁЧ™Чљ ЧњЧ”Ч™Ч•ЧЄ Ч–Ч”Ч” ЧђЧ• ЧњЧ¤Ч Ч™ {label}.",
  startMonth: "Ч Чђ ЧњЧ‘Ч—Ч•ЧЁ Ч—Ч•Ч“Ч© Ч”ЧЄЧ—ЧњЧ”",
  sameMonth:
    "Ч©Ч Ч™ ЧЄЧђЧЁЧ™Ч›Ч™Чќ ЧђЧњЧ” Ч¦ЧЁЧ™Ч›Ч™Чќ ЧњЧ”Ч™Ч•ЧЄ Ч‘ЧђЧ•ЧЄЧ• Ч—Ч•Ч“Ч© - Ч Чђ ЧњЧ©Ч Ч•ЧЄ ЧђЧ—Ч“ Ч”ЧЄЧђЧЁЧ™Ч›Ч™Чќ.",
  creditcard:
    "ЧћЧЎЧ¤ЧЁ Ч›ЧЁЧЧ™ЧЎ Ч”ЧђЧ©ЧЁЧђЧ™ Ч©Ч”Ч•Ч–Чџ ЧђЧ™Ч Ч• Ч—Ч•Ч§Ч™. Ч Чђ ЧњЧ‘Ч“Ч•Ч§ Ч©Ч Ч™ЧЄ. Ч”Ч•Ч–Ч Ч• {length} ЧЎЧ¤ЧЁЧ•ЧЄ.",
});
Locale.define("he-IL", "Number", {
  decimal: ".",
  group: ",",
  currency: { suffix: " в‚Є" },
});
Locale.define("hu-HU", "Date", {
  months: [
    "JanuГЎr",
    "FebruГЎr",
    "MГЎrcius",
    "ГЃprilis",
    "MГЎjus",
    "JГєnius",
    "JГєlius",
    "Augusztus",
    "Szeptember",
    "OktГіber",
    "November",
    "December",
  ],
  months_abbr: [
    "jan.",
    "febr.",
    "mГЎrc.",
    "ГЎpr.",
    "mГЎj.",
    "jГєn.",
    "jГєl.",
    "aug.",
    "szept.",
    "okt.",
    "nov.",
    "dec.",
  ],
  days: [
    "VasГЎrnap",
    "HГ©tfЕ‘",
    "Kedd",
    "Szerda",
    "CsГјtГ¶rtГ¶k",
    "PГ©ntek",
    "Szombat",
  ],
  days_abbr: ["V", "H", "K", "Sze", "Cs", "P", "Szo"],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y.%m.%d.",
  shortTime: "%I:%M",
  AM: "de.",
  PM: "du.",
  firstDayOfWeek: 1,
  ordinal: ".",
  lessThanMinuteAgo: "alig egy perce",
  minuteAgo: "egy perce",
  minutesAgo: "{delta} perce",
  hourAgo: "egy ГіrГЎja",
  hoursAgo: "{delta} ГіrГЎja",
  dayAgo: "1 napja",
  daysAgo: "{delta} napja",
  weekAgo: "1 hete",
  weeksAgo: "{delta} hete",
  monthAgo: "1 hГіnapja",
  monthsAgo: "{delta} hГіnapja",
  yearAgo: "1 Г©ve",
  yearsAgo: "{delta} Г©ve",
  lessThanMinuteUntil: "alig egy perc mГєlva",
  minuteUntil: "egy perc mГєlva",
  minutesUntil: "{delta} perc mГєlva",
  hourUntil: "egy Гіra mГєlva",
  hoursUntil: "{delta} Гіra mГєlva",
  dayUntil: "1 nap mГєlva",
  daysUntil: "{delta} nap mГєlva",
  weekUntil: "1 hГ©t mГєlva",
  weeksUntil: "{delta} hГ©t mГєlva",
  monthUntil: "1 hГіnap mГєlva",
  monthsUntil: "{delta} hГіnap mГєlva",
  yearUntil: "1 Г©v mГєlva",
  yearsUntil: "{delta} Г©v mГєlva",
});
Locale.define("hu-HU", "FormValidator", {
  required: "A mezЕ‘ kitГ¶ltГ©se kГ¶telezЕ‘.",
  minLength:
    "LegalГЎbb {minLength} karakter megadГЎsa szГјksГ©ges (megadva {length} karakter).",
  maxLength:
    "Legfeljebb {maxLength} karakter megadГЎsa lehetsГ©ges (megadva {length} karakter).",
  integer:
    "EgГ©sz szГЎm megadГЎsa szГјksГ©ges. A tizedesjegyek (pl. 1.25) nem engedГ©lyezettek.",
  numeric:
    'SzГЎm megadГЎsa szГјksГ©ges (pl. "1" vagy "1.1" vagy "-1" vagy "-1.1").',
  digits:
    "Csak szГЎmok Г©s Г­rГЎsjelek megadГЎsa lehetsГ©ges (pl. telefonszГЎm kГ¶tЕ‘jelek Г©s/vagy perjelekkel).",
  alpha:
    "Csak betЕ±k (a-z) megadГЎsa lehetsГ©ges. SzГіkГ¶z Г©s egyГ©b karakterek nem engedГ©lyezettek.",
  alphanum:
    "Csak betЕ±k (a-z) vagy szГЎmok (0-9) megadГЎsa lehetsГ©ges. SzГіkГ¶z Г©s egyГ©b karakterek nem engedГ©lyezettek.",
  dateSuchAs: "ValГіs dГЎtum megadГЎsa szГјksГ©ges (pl. {date}).",
  dateInFormatMDY:
    'ValГіs dГЎtum megadГЎsa szГјksГ©ges Г‰Г‰Г‰Г‰.HH.NN. formГЎban. (pl. "1999.12.31.")',
  email: 'ValГіs e-mail cГ­m megadГЎsa szГјksГ©ges (pl. "fred@domain.hu").',
  url: "ValГіs URL megadГЎsa szГјksГ©ges (pl. http://www.example.com).",
  currencyDollar: "ValГіs pГ©nzГ¶sszeg megadГЎsa szГјksГ©ges (pl. 100.00 Ft.).",
  oneRequired: "Az alГЎbbi mezЕ‘k legalГЎbb egyikГ©nek kitГ¶ltГ©se kГ¶telezЕ‘.",
  errorPrefix: "Hiba: ",
  warningPrefix: "Figyelem: ",
  noSpace: "A mezЕ‘ nem tartalmazhat szГіkГ¶zГ¶ket.",
  reqChkByNode: "Nincs egyetlen kijelГ¶lt elem sem.",
  requiredChk: "A mezЕ‘ kitГ¶ltГ©se kГ¶telezЕ‘.",
  reqChkByName: "Egy {label} kivГЎlasztГЎsa szГјksГ©ges.",
  match: "A mezЕ‘nek egyeznie kell a(z) {matchName} mezЕ‘vel.",
  startDate: "a kezdet dГЎtuma",
  endDate: "a vГ©g dГЎtuma",
  currendDate: "jelenlegi dГЎtum",
  afterDate: "A dГЎtum nem lehet kisebb, mint {label}.",
  beforeDate: "A dГЎtum nem lehet nagyobb, mint {label}.",
  startMonth: "Kezdeti hГіnap megadГЎsa szГјksГ©ges.",
  sameMonth: "A kГ©t dГЎtumnak ugyanazon hГіnapban kell lennie.",
  creditcard:
    "A megadott bankkГЎrtyaszГЎm nem valГіdi (megadva {length} szГЎmjegy).",
});
Locale.define("it-IT", "Date", {
  months: [
    "Gennaio",
    "Febbraio",
    "Marzo",
    "Aprile",
    "Maggio",
    "Giugno",
    "Luglio",
    "Agosto",
    "Settembre",
    "Ottobre",
    "Novembre",
    "Dicembre",
  ],
  months_abbr: [
    "gen",
    "feb",
    "mar",
    "apr",
    "mag",
    "giu",
    "lug",
    "ago",
    "set",
    "ott",
    "nov",
    "dic",
  ],
  days: [
    "Domenica",
    "LunedГ¬",
    "MartedГ¬",
    "MercoledГ¬",
    "GiovedГ¬",
    "VenerdГ¬",
    "Sabato",
  ],
  days_abbr: ["dom", "lun", "mar", "mer", "gio", "ven", "sab"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d/%m/%Y",
  shortTime: "%H.%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "Вє",
  lessThanMinuteAgo: "meno di un minuto fa",
  minuteAgo: "circa un minuto fa",
  minutesAgo: "circa {delta} minuti fa",
  hourAgo: "circa un'ora fa",
  hoursAgo: "circa {delta} ore fa",
  dayAgo: "circa 1 giorno fa",
  daysAgo: "circa {delta} giorni fa",
  weekAgo: "una settimana fa",
  weeksAgo: "{delta} settimane fa",
  monthAgo: "un mese fa",
  monthsAgo: "{delta} mesi fa",
  yearAgo: "un anno fa",
  yearsAgo: "{delta} anni fa",
  lessThanMinuteUntil: "tra meno di un minuto",
  minuteUntil: "tra circa un minuto",
  minutesUntil: "tra circa {delta} minuti",
  hourUntil: "tra circa un'ora",
  hoursUntil: "tra circa {delta} ore",
  dayUntil: "tra circa un giorno",
  daysUntil: "tra circa {delta} giorni",
  weekUntil: "tra una settimana",
  weeksUntil: "tra {delta} settimane",
  monthUntil: "tra un mese",
  monthsUntil: "tra {delta} mesi",
  yearUntil: "tra un anno",
  yearsUntil: "tra {delta} anni",
});
Locale.define("it-IT", "FormValidator", {
  required: "Il campo &egrave; obbligatorio.",
  minLength:
    "Inserire almeno {minLength} caratteri (ne sono stati inseriti {length}).",
  maxLength:
    "Inserire al massimo {maxLength} caratteri (ne sono stati inseriti {length}).",
  integer:
    "Inserire un numero intero. Non sono consentiti decimali (es.: 1.25).",
  numeric:
    'Inserire solo valori numerici (es.: "1" oppure "1.1" oppure "-1" oppure "-1.1").',
  digits:
    "Inserire solo numeri e caratteri di punteggiatura. Per esempio &egrave; consentito un numero telefonico con trattini o punti.",
  alpha:
    "Inserire solo lettere (a-z). Non sono consentiti spazi o altri caratteri.",
  alphanum:
    "Inserire solo lettere (a-z) o numeri (0-9). Non sono consentiti spazi o altri caratteri.",
  dateSuchAs: "Inserire una data valida del tipo {date}",
  dateInFormatMDY:
    'Inserire una data valida nel formato MM/GG/AAAA (es.: "12/31/1999")',
  email: 'Inserire un indirizzo email valido. Per esempio "nome@dominio.com".',
  url: 'Inserire un indirizzo valido. Per esempio "http://www.example.com".',
  currencyDollar: 'Inserire un importo valido. Per esempio "$100.00".',
  oneRequired: "Completare almeno uno dei campi richiesti.",
  errorPrefix: "Errore: ",
  warningPrefix: "Attenzione: ",
  noSpace: "Non sono consentiti spazi.",
  reqChkByNode: "Nessuna voce selezionata.",
  requiredChk: "Il campo &egrave; obbligatorio.",
  reqChkByName: "Selezionare un(a) {label}.",
  match: "Il valore deve corrispondere al campo {matchName}",
  startDate: "data d'inizio",
  endDate: "data di fine",
  currendDate: "data attuale",
  afterDate: "La data deve corrispondere o essere successiva al {label}.",
  beforeDate: "La data deve corrispondere o essere precedente al {label}.",
  startMonth: "Selezionare un mese d'inizio",
  sameMonth:
    "Le due date devono essere dello stesso mese - occorre modificarne una.",
});
Locale.define("ja-JP", "Date", {
  months: [
    "1жњ€",
    "2жњ€",
    "3жњ€",
    "4жњ€",
    "5жњ€",
    "6жњ€",
    "7жњ€",
    "8жњ€",
    "9жњ€",
    "10жњ€",
    "11жњ€",
    "12жњ€",
  ],
  months_abbr: [
    "1жњ€",
    "2жњ€",
    "3жњ€",
    "4жњ€",
    "5жњ€",
    "6жњ€",
    "7жњ€",
    "8жњ€",
    "9жњ€",
    "10жњ€",
    "11жњ€",
    "12жњ€",
  ],
  days: [
    "ж—Ґж›њж—Ґ",
    "жњ€ж›њж—Ґ",
    "зЃ«ж›њж—Ґ",
    "ж°ґж›њж—Ґ",
    "жњЁж›њж—Ґ",
    "й‡‘ж›њж—Ґ",
    "ењџж›њж—Ґ",
  ],
  days_abbr: ["ж—Ґ", "жњ€", "зЃ«", "ж°ґ", "жњЁ", "й‡‘", "ењџ"],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y/%m/%d",
  shortTime: "%H:%M",
  AM: "еЌ€е‰Ќ",
  PM: "еЌ€еѕЊ",
  firstDayOfWeek: 0,
  ordinal: "",
  lessThanMinuteAgo: "1е€†д»Ґе†…е‰Ќ",
  minuteAgo: "зґ„1е€†е‰Ќ",
  minutesAgo: "зґ„{delta}е€†е‰Ќ",
  hourAgo: "зґ„1ж™‚й–“е‰Ќ",
  hoursAgo: "зґ„{delta}ж™‚й–“е‰Ќ",
  dayAgo: "1ж—Ґе‰Ќ",
  daysAgo: "{delta}ж—Ґе‰Ќ",
  weekAgo: "1йЂ±й–“е‰Ќ",
  weeksAgo: "{delta}йЂ±й–“е‰Ќ",
  monthAgo: "1гѓ¶жњ€е‰Ќ",
  monthsAgo: "{delta}гѓ¶жњ€е‰Ќ",
  yearAgo: "1е№ґе‰Ќ",
  yearsAgo: "{delta}е№ґе‰Ќ",
  lessThanMinuteUntil: "д»ЉгЃ‹г‚‰зґ„1е€†д»Ґе†…",
  minuteUntil: "д»ЉгЃ‹г‚‰зґ„1е€†",
  minutesUntil: "д»ЉгЃ‹г‚‰зґ„{delta}е€†",
  hourUntil: "д»ЉгЃ‹г‚‰зґ„1ж™‚й–“",
  hoursUntil: "д»ЉгЃ‹г‚‰зґ„{delta}ж™‚й–“",
  dayUntil: "д»ЉгЃ‹г‚‰1ж—Ґй–“",
  daysUntil: "д»ЉгЃ‹г‚‰{delta}ж—Ґй–“",
  weekUntil: "д»ЉгЃ‹г‚‰1йЂ±й–“",
  weeksUntil: "д»ЉгЃ‹г‚‰{delta}йЂ±й–“",
  monthUntil: "д»ЉгЃ‹г‚‰1гѓ¶жњ€",
  monthsUntil: "д»ЉгЃ‹г‚‰{delta}гѓ¶жњ€",
  yearUntil: "д»ЉгЃ‹г‚‰1е№ґ",
  yearsUntil: "д»ЉгЃ‹г‚‰{delta}е№ґ",
});
Locale.define("ja-JP", "FormValidator", {
  required: "е…ҐеЉ›гЃЇеї…й €гЃ§гЃ™гЂ‚",
  minLength:
    "е…ҐеЉ›ж–‡е­—ж•°гЃЇ{minLength}д»ҐдёЉгЃ«гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚({length}ж–‡е­—)",
  maxLength:
    "е…ҐеЉ›ж–‡е­—ж•°гЃЇ{maxLength}д»Ґдё‹гЃ«гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚({length}ж–‡е­—)",
  integer: "ж•ґж•°г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  numeric:
    'е…ҐеЉ›гЃ§гЃЌг‚‹гЃ®гЃЇж•°еЂ¤гЃ гЃ‘гЃ§гЃ™гЂ‚(дѕ‹: "1", "1.1", "-1", "-1.1"....)',
  digits:
    "е…ҐеЉ›гЃ§гЃЌг‚‹гЃ®гЃЇж•°еЂ¤гЃЁеЏҐиЄ­иЁеЏ·гЃ§гЃ™гЂ‚ (дѕ‹: -г‚„+г‚’еђ«г‚Ђй›»и©±з•ЄеЏ·гЃЄгЃ©).",
  alpha:
    "е…ҐеЉ›гЃ§гЃЌг‚‹гЃ®гЃЇеЌЉи§’и‹±е­—гЃ гЃ‘гЃ§гЃ™гЂ‚гЃќг‚Њд»Ґе¤–гЃ®ж–‡е­—гЃЇе…ҐеЉ›гЃ§гЃЌгЃѕгЃ›г‚“гЂ‚",
  alphanum:
    "е…ҐеЉ›гЃ§гЃЌг‚‹гЃ®гЃЇеЌЉи§’и‹±ж•°е­—гЃ гЃ‘гЃ§гЃ™гЂ‚гЃќг‚Њд»Ґе¤–гЃ®ж–‡е­—гЃЇе…ҐеЉ›гЃ§гЃЌгЃѕгЃ›г‚“гЂ‚",
  dateSuchAs: "жњ‰еЉ№гЃЄж—Ґд»г‚’е…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚{date}",
  dateInFormatMDY:
    'ж—Ґд»гЃ®ж›ёејЏгЃ«иЄ¤г‚ЉгЃЊгЃ‚г‚ЉгЃѕгЃ™гЂ‚YYYY/MM/DD (i.e. "1999/12/31")',
  email: "гѓЎгѓјгѓ«г‚ўгѓ‰гѓ¬г‚№гЃ«иЄ¤г‚ЉгЃЊгЃ‚г‚ЉгЃѕгЃ™гЂ‚",
  url: "URLг‚ўгѓ‰гѓ¬г‚№гЃ«иЄ¤г‚ЉгЃЊгЃ‚г‚ЉгЃѕгЃ™гЂ‚",
  currencyDollar: "й‡‘йЎЌгЃ«иЄ¤г‚ЉгЃЊгЃ‚г‚ЉгЃѕгЃ™гЂ‚",
  oneRequired: "гЃІгЃЁгЃ¤д»ҐдёЉе…ҐеЉ›гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  errorPrefix: "г‚Ёгѓ©гѓј: ",
  warningPrefix: "и­¦е‘Љ: ",
  noSpace: "г‚№гѓљгѓјг‚№гЃЇе…ҐеЉ›гЃ§гЃЌгЃѕгЃ›г‚“гЂ‚",
  reqChkByNode: "йЃёжЉћгЃ•г‚ЊгЃ¦гЃ„гЃѕгЃ›г‚“гЂ‚",
  requiredChk: "гЃ“гЃ®й …з›®гЃЇеї…й €гЃ§гЃ™гЂ‚",
  reqChkByName: "{label}г‚’йЃёжЉћгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  match: "{matchName}гЃЊе…ҐеЉ›гЃ•г‚ЊгЃ¦гЃ„г‚‹е ґеђ€еї…й €гЃ§гЃ™гЂ‚",
  startDate: "й–‹е§‹ж—Ґ",
  endDate: "зµ‚дє†ж—Ґ",
  currendDate: "д»Љж—Ґ",
  afterDate: "{label}д»Ґй™ЌгЃ®ж—Ґд»гЃ«гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  beforeDate: "{label}д»Ґе‰ЌгЃ®ж—Ґд»гЃ«гЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  startMonth: "й–‹е§‹жњ€г‚’йЃёжЉћгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
  sameMonth:
    "ж—Ґд»гЃЊеђЊдёЂгЃ§гЃ™гЂ‚гЃ©гЃЎг‚‰гЃ‹г‚’е¤‰ж›ґгЃ—гЃ¦гЃЏгЃ гЃ•гЃ„гЂ‚",
});
Locale.define("ja-JP", "Number", {
  decimal: ".",
  group: ",",
  currency: { decimals: 0, prefix: "\\" },
});
Locale.define("nl-NL", "Date", {
  months: [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december",
  ],
  months_abbr: [
    "jan",
    "feb",
    "mrt",
    "apr",
    "mei",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
  days: [
    "zondag",
    "maandag",
    "dinsdag",
    "woensdag",
    "donderdag",
    "vrijdag",
    "zaterdag",
  ],
  days_abbr: ["zo", "ma", "di", "wo", "do", "vr", "za"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d-%m-%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "e",
  lessThanMinuteAgo: "minder dan een minuut geleden",
  minuteAgo: "ongeveer een minuut geleden",
  minutesAgo: "{delta} minuten geleden",
  hourAgo: "ongeveer een uur geleden",
  hoursAgo: "ongeveer {delta} uur geleden",
  dayAgo: "een dag geleden",
  daysAgo: "{delta} dagen geleden",
  weekAgo: "een week geleden",
  weeksAgo: "{delta} weken geleden",
  monthAgo: "een maand geleden",
  monthsAgo: "{delta} maanden geleden",
  yearAgo: "een jaar geleden",
  yearsAgo: "{delta} jaar geleden",
  lessThanMinuteUntil: "over minder dan een minuut",
  minuteUntil: "over ongeveer een minuut",
  minutesUntil: "over {delta} minuten",
  hourUntil: "over ongeveer een uur",
  hoursUntil: "over {delta} uur",
  dayUntil: "over ongeveer een dag",
  daysUntil: "over {delta} dagen",
  weekUntil: "over een week",
  weeksUntil: "over {delta} weken",
  monthUntil: "over een maand",
  monthsUntil: "over {delta} maanden",
  yearUntil: "over een jaar",
  yearsUntil: "over {delta} jaar",
});
Locale.define("nl-NL", "FormValidator", {
  required: "Dit veld is verplicht.",
  length:
    "Vul precies {length} karakters in (je hebt {elLength} karakters ingevoerd).",
  minLength:
    "Vul minimaal {minLength} karakters in (je hebt {length} karakters ingevoerd).",
  maxLength:
    "Vul niet meer dan {maxLength} karakters in (je hebt {length} karakters ingevoerd).",
  integer:
    "Vul een getal in. Getallen met decimalen (bijvoorbeeld 1.25) zijn niet toegestaan.",
  numeric:
    'Vul alleen numerieke waarden in (bijvoorbeeld "1" of "1.1" of "-1" of "-1.1").',
  digits:
    "Vul alleen nummers en leestekens in (bijvoorbeeld een telefoonnummer met streepjes is toegestaan).",
  alpha:
    "Vul alleen letters in (a-z). Spaties en andere karakters zijn niet toegestaan.",
  alphanum:
    "Vul alleen letters (a-z) of nummers (0-9) in. Spaties en andere karakters zijn niet toegestaan.",
  dateSuchAs: "Vul een geldige datum in, zoals {date}",
  dateInFormatMDY:
    'Vul een geldige datum, in het formaat MM/DD/YYYY (bijvoorbeeld "12/31/1999")',
  email: 'Vul een geldig e-mailadres in. Bijvoorbeeld "fred@domein.nl".',
  url: "Vul een geldige URL in, zoals http://www.example.com.",
  currencyDollar: "Vul een geldig $ bedrag in. Bijvoorbeeld $100.00 .",
  oneRequired: "Vul iets in bij in ieder geval een van deze velden.",
  warningPrefix: "Waarschuwing: ",
  errorPrefix: "Fout: ",
  noSpace: "Spaties zijn niet toegestaan in dit veld.",
  reqChkByNode: "Er zijn geen items geselecteerd.",
  requiredChk: "Dit veld is verplicht.",
  reqChkByName: "Selecteer een {label}.",
  match: "Dit veld moet overeen komen met het {matchName} veld",
  startDate: "de begin datum",
  endDate: "de eind datum",
  currendDate: "de huidige datum",
  afterDate: "De datum moet hetzelfde of na {label} zijn.",
  beforeDate: "De datum moet hetzelfde of voor {label} zijn.",
  startMonth: "Selecteer een begin maand",
  sameMonth:
    "Deze twee data moeten in dezelfde maand zijn - u moet een van beide aanpassen.",
  creditcard:
    "Het ingevulde creditcardnummer is niet geldig. Controleer het nummer en probeer opnieuw. {length} getallen ingevuld.",
});
Locale.define("nl-NL").inherit("EU", "Number");
Locale.define("no-NO", "Date", {
  dateOrder: ["date", "month", "year"],
  shortDate: "%d.%m.%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  lessThanMinuteAgo: "kortere enn et minutt siden",
  minuteAgo: "omtrent et minutt siden",
  minutesAgo: "{delta} minutter siden",
  hourAgo: "omtrent en time siden",
  hoursAgo: "omtrent {delta} timer siden",
  dayAgo: "{delta} dag siden",
  daysAgo: "{delta} dager siden",
});
Locale.define("no-NO", "FormValidator", {
  required: "Dette feltet er pГѓВҐkrevd.",
  minLength:
    "Vennligst skriv inn minst {minLength} tegn (du skrev {length} tegn).",
  maxLength:
    "Vennligst skriv inn maksimalt {maxLength} tegn (du skrev {length} tegn).",
  integer:
    "Vennligst skriv inn et tall i dette feltet. Tall med desimaler (for eksempel 1,25) er ikke tillat.",
  numeric:
    'Vennligst skriv inn kun numeriske verdier i dette feltet (for eksempel "1", "1.1", "-1" eller "-1.1").',
  digits: "Vennligst bruk kun nummer og skilletegn i dette feltet.",
  alpha:
    "Vennligst bruk kun bokstaver (a-z) i dette feltet. Ingen mellomrom eller andre tegn er tillat.",
  alphanum:
    "Vennligst bruk kun bokstaver (a-z) eller nummer (0-9) i dette feltet. Ingen mellomrom eller andre tegn er tillat.",
  dateSuchAs: "Vennligst skriv inn en gyldig dato, som {date}",
  dateInFormatMDY:
    'Vennligst skriv inn en gyldig dato, i formatet MM/DD/YYYY (for eksempel "12/31/1999")',
  email:
    'Vennligst skriv inn en gyldig epost-adresse. For eksempel "espen@domene.no".',
  url: "Vennligst skriv inn en gyldig URL, for eksempel http://www.example.com.",
  currencyDollar:
    "Vennligst fyll ut et gyldig $ belГѓВёp. For eksempel $100.00 .",
  oneRequired: "Vennligst fyll ut noe i minst ett av disse feltene.",
  errorPrefix: "Feil: ",
  warningPrefix: "Advarsel: ",
});
Locale.define("pl-PL", "Date", {
  months: [
    "StyczeЕ„",
    "Luty",
    "Marzec",
    "KwiecieЕ„",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "SierpieЕ„",
    "WrzesieЕ„",
    "PaЕєdziernik",
    "Listopad",
    "GrudzieЕ„",
  ],
  months_abbr: [
    "sty",
    "lut",
    "mar",
    "kwi",
    "maj",
    "cze",
    "lip",
    "sie",
    "wrz",
    "paЕє",
    "lis",
    "gru",
  ],
  days: [
    "Niedziela",
    "PoniedziaЕ‚ek",
    "Wtorek",
    "Ељroda",
    "Czwartek",
    "PiД…tek",
    "Sobota",
  ],
  days_abbr: ["niedz.", "pon.", "wt.", "Е›r.", "czw.", "pt.", "sob."],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y-%m-%d",
  shortTime: "%H:%M",
  AM: "nad ranem",
  PM: "po poЕ‚udniu",
  firstDayOfWeek: 1,
  ordinal: function (a) {
    return a > 3 && a < 21
      ? "ty"
      : ["ty", "szy", "gi", "ci", "ty"][Math.min(a % 10, 4)];
  },
  lessThanMinuteAgo: "mniej niЕј minute temu",
  minuteAgo: "okoЕ‚o minutД™ temu",
  minutesAgo: "{delta} minut temu",
  hourAgo: "okoЕ‚o godzinД™ temu",
  hoursAgo: "okoЕ‚o {delta} godzin temu",
  dayAgo: "Wczoraj",
  daysAgo: "{delta} dni temu",
  lessThanMinuteUntil: "za niecaЕ‚Д… minutД™",
  minuteUntil: "za okoЕ‚o minutД™",
  minutesUntil: "za {delta} minut",
  hourUntil: "za okoЕ‚o godzinД™",
  hoursUntil: "za okoЕ‚o {delta} godzin",
  dayUntil: "za 1 dzieЕ„",
  daysUntil: "za {delta} dni",
});
Locale.define("pl-PL", "FormValidator", {
  required: "To pole jest wymagane.",
  minLength:
    "Wymagane jest przynajmniej {minLength} znakГіw (wpisanych zostaЕ‚o tylko {length}).",
  maxLength:
    "Dozwolone jest nie wiД™cej niЕј {maxLength} znakГіw (wpisanych zostaЕ‚o {length})",
  integer:
    "To pole wymaga liczb caЕ‚ych. Liczby dziesiД™tne (np. 1.25) sД… niedozwolone.",
  numeric:
    'Prosimy uЕјywaД‡ tylko numerycznych wartoЕ›ci w tym polu (np. "1", "1.1", "-1" lub "-1.1").',
  digits:
    "Prosimy uЕјywaД‡ liczb oraz zankow punktuacyjnych w typ polu (dla przykЕ‚adu, przy numerze telefonu myЕ›lniki i kropki sД… dozwolone).",
  alpha:
    "Prosimy uЕјywaД‡ tylko liter (a-z) w tym polu. Spacje oraz inne znaki sД… niedozwolone.",
  alphanum:
    "Prosimy uЕјywaД‡ tylko liter (a-z) lub liczb (0-9) w tym polu. Spacje oraz inne znaki sД… niedozwolone.",
  dateSuchAs: "Prosimy podaД‡ prawidЕ‚owД… datД™ w formacie: {date}",
  dateInFormatMDY:
    'Prosimy podaД‡ poprawnД… date w formacie DD.MM.RRRR (i.e. "12.01.2009")',
  email: 'Prosimy podaД‡ prawidЕ‚owy adres e-mail, np. "jan@domena.pl".',
  url: "Prosimy podaД‡ prawidЕ‚owy adres URL, np. http://www.example.com.",
  currencyDollar:
    "Prosimy podaД‡ prawidЕ‚owД… sumД™ w PLN. Dla przykЕ‚adu: 100.00 PLN.",
  oneRequired: "Prosimy wypeЕ‚niД‡ chociaЕј jedno z pГіl.",
  errorPrefix: "BЕ‚Д…d: ",
  warningPrefix: "Uwaga: ",
  noSpace: "W tym polu nie mogД… znajdowaД‡ siД™ spacje.",
  reqChkByNode: "Brak zaznaczonych elementГіw.",
  requiredChk: "To pole jest wymagane.",
  reqChkByName: "Prosimy wybraД‡ z {label}.",
  match: "To pole musi byД‡ takie samo jak {matchName}",
  startDate: "data poczД…tkowa",
  endDate: "data koЕ„cowa",
  currendDate: "aktualna data",
  afterDate: "Podana data poinna byД‡ taka sama lub po {label}.",
  beforeDate: "Podana data poinna byД‡ taka sama lub przed {label}.",
  startMonth: "Prosimy wybraД‡ poczД…tkowy miesiД…c.",
  sameMonth:
    "Te dwie daty muszД… byД‡ w zakresie tego samego miesiД…ca - wymagana jest zmiana ktГіregoЕ› z pГіl.",
});
Locale.define("pt-PT", "Date", {
  months: [
    "Janeiro",
    "Fevereiro",
    "MarГ§o",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  months_abbr: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  days: [
    "Domingo",
    "Segunda-feira",
    "TerГ§a-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "SГЎbado",
  ],
  days_abbr: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "SГЎb"],
  dateOrder: ["date", "month", "year"],
  shortDate: "%d-%m-%Y",
  shortTime: "%H:%M",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "Вє",
  lessThanMinuteAgo: "hГЎ menos de um minuto",
  minuteAgo: "hГЎ cerca de um minuto",
  minutesAgo: "hГЎ {delta} minutos",
  hourAgo: "hГЎ cerca de uma hora",
  hoursAgo: "hГЎ cerca de {delta} horas",
  dayAgo: "hГЎ um dia",
  daysAgo: "hГЎ {delta} dias",
  weekAgo: "hГЎ uma semana",
  weeksAgo: "hГЎ {delta} semanas",
  monthAgo: "hГЎ um mГЄs",
  monthsAgo: "hГЎ {delta} meses",
  yearAgo: "hГЎ um ano",
  yearsAgo: "hГЎ {delta} anos",
  lessThanMinuteUntil: "em menos de um minuto",
  minuteUntil: "em um minuto",
  minutesUntil: "em {delta} minutos",
  hourUntil: "em uma hora",
  hoursUntil: "em {delta} horas",
  dayUntil: "em um dia",
  daysUntil: "em {delta} dias",
  weekUntil: "em uma semana",
  weeksUntil: "em {delta} semanas",
  monthUntil: "em um mГЄs",
  monthsUntil: "em {delta} meses",
  yearUntil: "em um ano",
  yearsUntil: "em {delta} anos",
});
Locale.define("pt-BR", "Date", { shortDate: "%d/%m/%Y" }).inherit(
  "pt-PT",
  "Date"
);
Locale.define("pt-BR", "FormValidator", {
  required: "Este campo Г© obrigatГіrio.",
  minLength:
    "Digite pelo menos {minLength} caracteres (tamanho atual: {length}).",
  maxLength:
    "NГЈo digite mais de {maxLength} caracteres (tamanho atual: {length}).",
  integer:
    "Por favor digite apenas um nГєmero inteiro neste campo. NГЈo sГЈo permitidos nГєmeros decimais (por exemplo, 1,25).",
  numeric:
    'Por favor digite apenas valores numГ©ricos neste campo (por exemplo, "1" ou "1.1" ou "-1" ou "-1,1").',
  digits:
    "Por favor use apenas nГєmeros e pontuaГ§ГЈo neste campo (por exemplo, um nГєmero de telefone com traГ§os ou pontos Г© permitido).",
  alpha:
    "Por favor use somente letras (a-z). EspaГ§o e outros caracteres nГЈo sГЈo permitidos.",
  alphanum:
    "Use somente letras (a-z) ou nГєmeros (0-9) neste campo. EspaГ§o e outros caracteres nГЈo sГЈo permitidos.",
  dateSuchAs: "Digite uma data vГЎlida, como {date}",
  dateInFormatMDY:
    'Digite uma data vГЎlida, como DD/MM/YYYY (por exemplo, "31/12/1999")',
  email:
    'Digite um endereГ§o de email vГЎlido. Por exemplo "nome@dominio.com".',
  url: "Digite uma URL vГЎlida. Exemplo: http://www.example.com.",
  currencyDollar: "Digite um valor em dinheiro vГЎlido. Exemplo: R$100,00 .",
  oneRequired: "Digite algo para pelo menos um desses campos.",
  errorPrefix: "Erro: ",
  warningPrefix: "Aviso: ",
  noSpace: "NГЈo Г© possГ­vel digitar espaГ§os neste campo.",
  reqChkByNode: "NГЈo foi selecionado nenhum item.",
  requiredChk: "Este campo Г© obrigatГіrio.",
  reqChkByName: "Por favor digite um {label}.",
  match: "Este campo deve ser igual ao campo {matchName}.",
  startDate: "a data inicial",
  endDate: "a data final",
  currendDate: "a data atual",
  afterDate: "A data deve ser igual ou posterior a {label}.",
  beforeDate: "A data deve ser igual ou anterior a {label}.",
  startMonth: "Por favor selecione uma data inicial.",
  sameMonth:
    "Estas duas datas devem ter o mesmo mГЄs - vocГЄ deve modificar uma das duas.",
  creditcard:
    "O nГєmero do cartГЈo de crГ©dito informado Г© invГЎlido. Por favor verifique o valor e tente novamente. {length} nГєmeros informados.",
});
Locale.define("pt-PT", "FormValidator", {
  required: "Este campo Г© necessГЎrio.",
  minLength:
    "Digite pelo menos{minLength} caracteres (comprimento {length} caracteres).",
  maxLength:
    "NГЈo insira mais de {maxLength} caracteres (comprimento {length} caracteres).",
  integer:
    "Digite um nГєmero inteiro neste domГ­nio. Com nГєmeros decimais (por exemplo, 1,25), nГЈo sГЈo permitidas.",
  numeric:
    'Digite apenas valores numГ©ricos neste domГ­nio (p.ex., "1" ou "1.1" ou "-1" ou "-1,1").',
  digits:
    "Por favor, use nГєmeros e pontuaГ§ГЈo apenas neste campo (p.ex., um nГєmero de telefone com traГ§os ou pontos Г© permitida).",
  alpha:
    "Por favor use somente letras (a-z), com nesta ГЎrea. NГЈo utilize espaГ§os nem outros caracteres sГЈo permitidos.",
  alphanum:
    "Use somente letras (a-z) ou nГєmeros (0-9) neste campo. NГЈo utilize espaГ§os nem outros caracteres sГЈo permitidos.",
  dateSuchAs: "Digite uma data vГЎlida, como {date}",
  dateInFormatMDY:
    'Digite uma data vГЎlida, como DD/MM/YYYY (p.ex. "31/12/1999")',
  email: 'Digite um endereГ§o de email vГЎlido. Por exemplo "fred@domain.com".',
  url: "Digite uma URL vГЎlida, como http://www.example.com.",
  currencyDollar: "Digite um valor vГЎlido $. Por exemplo $ 100,00. ",
  oneRequired: "Digite algo para pelo menos um desses insumos.",
  errorPrefix: "Erro: ",
  warningPrefix: "Aviso: ",
});
(function () {
  var a = function (h, e, d, g, b) {
    var c = h % 10,
      f = h % 100;
    if (c == 1 && f != 11) {
      return e;
    } else {
      if ((c == 2 || c == 3 || c == 4) && !(f == 12 || f == 13 || f == 14)) {
        return d;
      } else {
        if (
          c == 0 ||
          c == 5 ||
          c == 6 ||
          c == 7 ||
          c == 8 ||
          c == 9 ||
          f == 11 ||
          f == 12 ||
          f == 13 ||
          f == 14
        ) {
          return g;
        } else {
          return b;
        }
      }
    }
  };
  Locale.define("ru-RU", "Date", {
    months: [
      "РЇРЅРІР°СЂСЊ",
      "Р¤РµРІСЂР°Р»СЊ",
      "РњР°СЂС‚",
      "РђРїСЂРµР»СЊ",
      "РњР°Р№",
      "РСЋРЅСЊ",
      "РСЋР»СЊ",
      "РђРІРіСѓСЃС‚",
      "РЎРµРЅС‚СЏР±СЂСЊ",
      "РћРєС‚СЏР±СЂСЊ",
      "РќРѕСЏР±СЂСЊ",
      "Р”РµРєР°Р±СЂСЊ",
    ],
    months_abbr: [
      "СЏРЅРІ",
      "С„РµРІСЂ",
      "РјР°СЂС‚",
      "Р°РїСЂ",
      "РјР°Р№",
      "РёСЋРЅСЊ",
      "РёСЋР»СЊ",
      "Р°РІРі",
      "СЃРµРЅС‚",
      "РѕРєС‚",
      "РЅРѕСЏР±",
      "РґРµРє",
    ],
    days: [
      "Р’РѕСЃРєСЂРµСЃРµРЅСЊРµ",
      "РџРѕРЅРµРґРµР»СЊРЅРёРє",
      "Р’С‚РѕСЂРЅРёРє",
      "РЎСЂРµРґР°",
      "Р§РµС‚РІРµСЂРі",
      "РџСЏС‚РЅРёС†Р°",
      "РЎСѓР±Р±РѕС‚Р°",
    ],
    days_abbr: ["Р’СЃ", "РџРЅ", "Р’С‚", "РЎСЂ", "Р§С‚", "РџС‚", "РЎР±"],
    dateOrder: ["date", "month", "year"],
    shortDate: "%d.%m.%Y",
    shortTime: "%H:%M",
    AM: "AM",
    PM: "PM",
    firstDayOfWeek: 1,
    ordinal: "",
    lessThanMinuteAgo: "РјРµРЅСЊС€Рµ РјРёРЅСѓС‚С‹ РЅР°Р·Р°Рґ",
    minuteAgo: "РјРёРЅСѓС‚Сѓ РЅР°Р·Р°Рґ",
    minutesAgo: function (b) {
      return (
        "{delta} " +
        a(b, "РјРёРЅСѓС‚Сѓ", "РјРёРЅСѓС‚С‹", "РјРёРЅСѓС‚") +
        " РЅР°Р·Р°Рґ"
      );
    },
    hourAgo: "С‡Р°СЃ РЅР°Р·Р°Рґ",
    hoursAgo: function (b) {
      return (
        "{delta} " + a(b, "С‡Р°СЃ", "С‡Р°СЃР°", "С‡Р°СЃРѕРІ") + " РЅР°Р·Р°Рґ"
      );
    },
    dayAgo: "РІС‡РµСЂР°",
    daysAgo: function (b) {
      return (
        "{delta} " + a(b, "РґРµРЅСЊ", "РґРЅСЏ", "РґРЅРµР№") + " РЅР°Р·Р°Рґ"
      );
    },
    weekAgo: "РЅРµРґРµР»СЋ РЅР°Р·Р°Рґ",
    weeksAgo: function (b) {
      return (
        "{delta} " +
        a(b, "РЅРµРґРµР»СЏ", "РЅРµРґРµР»Рё", "РЅРµРґРµР»СЊ") +
        " РЅР°Р·Р°Рґ"
      );
    },
    monthAgo: "РјРµСЃСЏС† РЅР°Р·Р°Рґ",
    monthsAgo: function (b) {
      return (
        "{delta} " +
        a(b, "РјРµСЃСЏС†", "РјРµСЃСЏС†Р°", "РјРµСЃРµС†РµРІ") +
        " РЅР°Р·Р°Рґ"
      );
    },
    yearAgo: "РіРѕРґ РЅР°Р·Р°Рґ",
    yearsAgo: function (b) {
      return "{delta} " + a(b, "РіРѕРґ", "РіРѕРґР°", "Р»РµС‚") + " РЅР°Р·Р°Рґ";
    },
    lessThanMinuteUntil: "РјРµРЅСЊС€Рµ С‡РµРј С‡РµСЂРµР· РјРёРЅСѓС‚Сѓ",
    minuteUntil: "С‡РµСЂРµР· РјРёРЅСѓС‚Сѓ",
    minutesUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " + a(b, "С‡Р°СЃ", "С‡Р°СЃР°", "С‡Р°СЃРѕРІ") + ""
      );
    },
    hourUntil: "С‡РµСЂРµР· С‡Р°СЃ",
    hoursUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " + a(b, "С‡Р°СЃ", "С‡Р°СЃР°", "С‡Р°СЃРѕРІ") + ""
      );
    },
    dayUntil: "Р·Р°РІС‚СЂР°",
    daysUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " + a(b, "РґРµРЅСЊ", "РґРЅСЏ", "РґРЅРµР№") + ""
      );
    },
    weekUntil: "С‡РµСЂРµР· РЅРµРґРµР»СЋ",
    weeksUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "РЅРµРґРµР»СЋ", "РЅРµРґРµР»Рё", "РЅРµРґРµР»СЊ") +
        ""
      );
    },
    monthUntil: "С‡РµСЂРµР· РјРµСЃСЏС†",
    monthsUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "РјРµСЃСЏС†", "РјРµСЃСЏС†Р°", "РјРµСЃРµС†РµРІ") +
        ""
      );
    },
    yearUntil: "С‡РµСЂРµР·",
    yearsUntil: function (b) {
      return "С‡РµСЂРµР· {delta} " + a(b, "РіРѕРґ", "РіРѕРґР°", "Р»РµС‚") + "";
    },
  });
})();
Locale.define("ru-RU", "FormValidator", {
  required: "Р­С‚Рѕ РїРѕР»Рµ РѕР±СЏР·Р°С‚РµР»СЊРЅРѕ Рє Р·Р°РїРѕР»РЅРµРЅРёСЋ.",
  minLength:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ С…РѕС‚СЏ Р±С‹ {minLength} СЃРёРјРІРѕР»РѕРІ (Р’С‹ РІРІРµР»Рё {length}).",
  maxLength:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РЅРµ Р±РѕР»СЊС€Рµ {maxLength} СЃРёРјРІРѕР»РѕРІ (Р’С‹ РІРІРµР»Рё {length}).",
  integer:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РІ СЌС‚Рѕ РїРѕР»Рµ С‡РёСЃР»Рѕ. Р”СЂРѕР±РЅС‹Рµ С‡РёСЃР»Р° (РЅР°РїСЂРёРјРµСЂ 1.25) С‚СѓС‚ РЅРµ СЂР°Р·СЂРµС€РµРЅС‹.",
  numeric:
    'РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РІ СЌС‚Рѕ РїРѕР»Рµ С‡РёСЃР»Рѕ (РЅР°РїСЂРёРјРµСЂ "1" РёР»Рё "1.1", РёР»Рё "-1", РёР»Рё "-1.1").',
  digits:
    "Р’ СЌС‚РѕРј РїРѕР»Рµ Р’С‹ РјРѕР¶РµС‚Рµ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ С†РёС„СЂС‹ Рё Р·РЅР°РєРё РїСѓРЅРєС‚СѓР°С†РёРё (РЅР°РїСЂРёРјРµСЂ, С‚РµР»РµС„РѕРЅРЅС‹Р№ РЅРѕРјРµСЂ СЃРѕ Р·РЅР°РєР°РјРё РґРµС„РёСЃР° РёР»Рё СЃ С‚РѕС‡РєР°РјРё).",
  alpha:
    "Р’ СЌС‚РѕРј РїРѕР»Рµ РјРѕР¶РЅРѕ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ Р»Р°С‚РёРЅСЃРєРёРµ Р±СѓРєРІС‹ (a-z). РџСЂРѕР±РµР»С‹ Рё РґСЂСѓРіРёРµ СЃРёРјРІРѕР»С‹ Р·Р°РїСЂРµС‰РµРЅС‹.",
  alphanum:
    "Р’ СЌС‚РѕРј РїРѕР»Рµ РјРѕР¶РЅРѕ РёСЃРїРѕР»СЊР·РѕРІР°С‚СЊ С‚РѕР»СЊРєРѕ Р»Р°С‚РёРЅСЃРєРёРµ Р±СѓРєРІС‹ (a-z) Рё С†РёС„СЂС‹ (0-9). РџСЂРѕР±РµР»С‹ Рё РґСЂСѓРіРёРµ СЃРёРјРІРѕР»С‹ Р·Р°РїСЂРµС‰РµРЅС‹.",
  dateSuchAs:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅСѓСЋ РґР°С‚Сѓ {date}",
  dateInFormatMDY:
    'РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РґР°С‚Сѓ РІ С„РѕСЂРјР°С‚Рµ РњРњ/Р”Р”/Р“Р“Р“Р“ (РЅР°РїСЂРёРјРµСЂ "12/31/1999")',
  email:
    'РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РµРјРµР№Р»-Р°РґСЂРµСЃ. Р”Р»СЏ РїСЂРёРјРµСЂР° "fred@domain.com".',
  url: "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ РїСЂР°РІРёР»СЊРЅСѓСЋ СЃСЃС‹Р»РєСѓ РІРёРґР° http://www.example.com.",
  currencyDollar:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІРІРµРґРёС‚Рµ СЃСѓРјРјСѓ РІ РґРѕР»Р»Р°СЂР°С…. РќР°РїСЂРёРјРµСЂ: $100.00 .",
  oneRequired:
    "РџРѕР¶Р°Р»СѓР№СЃС‚Р°, РІС‹Р±РµСЂРёС‚Рµ С…РѕС‚СЊ С‡С‚Рѕ-РЅРёР±СѓРґСЊ РІ РѕРґРЅРѕРј РёР· СЌС‚РёС… РїРѕР»РµР№.",
  errorPrefix: "РћС€РёР±РєР°: ",
  warningPrefix: "Р’РЅРёРјР°РЅРёРµ: ",
});
(function () {
  var a = function (f, d, c, e, b) {
    return f >= 1 && f <= 3 ? arguments[f] : b;
  };
  Locale.define("si-SI", "Date", {
    months: [
      "januar",
      "februar",
      "marec",
      "april",
      "maj",
      "junij",
      "julij",
      "avgust",
      "september",
      "oktober",
      "november",
      "december",
    ],
    months_abbr: [
      "jan",
      "feb",
      "mar",
      "apr",
      "maj",
      "jun",
      "jul",
      "avg",
      "sep",
      "okt",
      "nov",
      "dec",
    ],
    days: [
      "nedelja",
      "ponedeljek",
      "torek",
      "sreda",
      "ДЌetrtek",
      "petek",
      "sobota",
    ],
    days_abbr: ["ned", "pon", "tor", "sre", "ДЌet", "pet", "sob"],
    dateOrder: ["date", "month", "year"],
    shortDate: "%d.%m.%Y",
    shortTime: "%H.%M",
    AM: "AM",
    PM: "PM",
    firstDayOfWeek: 1,
    ordinal: ".",
    lessThanMinuteAgo: "manj kot minuto nazaj",
    minuteAgo: "minuto nazaj",
    minutesAgo: function (b) {
      return (
        "{delta} " + a(b, "minuto", "minuti", "minute", "minut") + " nazaj"
      );
    },
    hourAgo: "uro nazaj",
    hoursAgo: function (b) {
      return "{delta} " + a(b, "uro", "uri", "ure", "ur") + " nazaj";
    },
    dayAgo: "dan nazaj",
    daysAgo: function (b) {
      return "{delta} " + a(b, "dan", "dneva", "dni", "dni") + " nazaj";
    },
    weekAgo: "teden nazaj",
    weeksAgo: function (b) {
      return "{delta} " + a(b, "teden", "tedna", "tedne", "tednov") + " nazaj";
    },
    monthAgo: "mesec nazaj",
    monthsAgo: function (b) {
      return (
        "{delta} " + a(b, "mesec", "meseca", "mesece", "mesecov") + " nazaj"
      );
    },
    yearthAgo: "leto nazaj",
    yearsAgo: function (b) {
      return "{delta} " + a(b, "leto", "leti", "leta", "let") + " nazaj";
    },
    lessThanMinuteUntil: "ЕЎe manj kot minuto",
    minuteUntil: "ЕЎe minuta",
    minutesUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "minuta", "minuti", "minute", "minut");
    },
    hourUntil: "ЕЎe ura",
    hoursUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "ura", "uri", "ure", "ur");
    },
    dayUntil: "ЕЎe dan",
    daysUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "dan", "dneva", "dnevi", "dni");
    },
    weekUntil: "ЕЎe tedn",
    weeksUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "teden", "tedna", "tedni", "tednov");
    },
    monthUntil: "ЕЎe mesec",
    monthsUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "mesec", "meseca", "meseci", "mesecov");
    },
    yearUntil: "ЕЎe leto",
    yearsUntil: function (b) {
      return "ЕЎe {delta} " + a(b, "leto", "leti", "leta", "let");
    },
  });
})();
Locale.define("si-SI", "FormValidator", {
  required: "To polje je obvezno",
  minLength:
    "Prosim, vnesite vsaj {minLength} znakov (vnesli ste {length} znakov).",
  maxLength:
    "Prosim, ne vnesite veДЌ kot {maxLength} znakov (vnesli ste {length} znakov).",
  integer:
    "Prosim, vnesite celo ЕЎtevilo. Decimalna ЕЎtevila (kot 1,25) niso dovoljena.",
  numeric:
    'Prosim, vnesite samo numeriДЌne vrednosti (kot "1" ali "1.1" ali "-1" ali "-1.1").',
  digits:
    "Prosim, uporabite ЕЎtevilke in loДЌila le na tem polju (na primer, dovoljena je telefonska ЕЎtevilka z pomiЕЎlaji ali pikami).",
  alpha:
    "Prosim, uporabite le ДЌrke v tem plju. Presledki in drugi znaki niso dovoljeni.",
  alphanum:
    "Prosim, uporabite samo ДЌrke ali ЕЎtevilke v tem polju. Presledki in drugi znaki niso dovoljeni.",
  dateSuchAs: "Prosim, vnesite pravilen datum kot {date}",
  dateInFormatMDY:
    'Prosim, vnesite pravilen datum kot MM.DD.YYYY (primer "12.31.1999")',
  email: 'Prosim, vnesite pravilen email naslov. Na primer "fred@domain.com".',
  url: "Prosim, vnesite pravilen URL kot http://www.example.com.",
  currencyDollar: "Prosim, vnesit epravilno vrednost в‚¬. Primer 100,00в‚¬ .",
  oneRequired: "Prosimo, vnesite nekaj za vsaj eno izmed teh polj.",
  errorPrefix: "Napaka: ",
  warningPrefix: "Opozorilo: ",
  noSpace: "To vnosno polje ne dopuЕЎДЌa presledkov.",
  reqChkByNode: "NiДЌ niste izbrali.",
  requiredChk: "To polje je obvezno",
  reqChkByName: "Prosim, izberite {label}.",
  match: "To polje se mora ujemati z poljem {matchName}",
  startDate: "datum zaДЌetka",
  endDate: "datum konca",
  currendDate: "trenuten datum",
  afterDate: "Datum bi moral biti isti ali po {label}.",
  beforeDate: "Datum bi moral biti isti ali pred {label}.",
  startMonth: "Prosim, vnesite zaДЌetni datum",
  sameMonth:
    "Ta dva datuma morata biti v istem mesecu - premeniti morate eno ali drugo.",
  creditcard:
    "Е tevilka kreditne kartice ni pravilna. Preverite ЕЎtevilko ali poskusite ЕЎe enkrat. VneЕЎenih {length} znakov.",
});
Locale.define("sv-SE", "Date", {
  months: [
    "januari",
    "februari",
    "mars",
    "april",
    "maj",
    "juni",
    "juli",
    "augusti",
    "september",
    "oktober",
    "november",
    "december",
  ],
  months_abbr: [
    "jan",
    "feb",
    "mar",
    "apr",
    "maj",
    "jun",
    "jul",
    "aug",
    "sep",
    "okt",
    "nov",
    "dec",
  ],
  days: [
    "sГ¶ndag",
    "mГҐndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lГ¶rdag",
  ],
  days_abbr: ["sГ¶n", "mГҐn", "tis", "ons", "tor", "fre", "lГ¶r"],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y-%m-%d",
  shortTime: "%H:%M",
  AM: "",
  PM: "",
  firstDayOfWeek: 1,
  ordinal: "",
  lessThanMinuteAgo: "mindre Г¤n en minut sedan",
  minuteAgo: "ungefГ¤r en minut sedan",
  minutesAgo: "{delta} minuter sedan",
  hourAgo: "ungefГ¤r en timme sedan",
  hoursAgo: "ungefГ¤r {delta} timmar sedan",
  dayAgo: "1 dag sedan",
  daysAgo: "{delta} dagar sedan",
  lessThanMinuteUntil: "mindre Г¤n en minut sedan",
  minuteUntil: "ungefГ¤r en minut sedan",
  minutesUntil: "{delta} minuter sedan",
  hourUntil: "ungefГ¤r en timme sedan",
  hoursUntil: "ungefГ¤r {delta} timmar sedan",
  dayUntil: "1 dag sedan",
  daysUntil: "{delta} dagar sedan",
});
Locale.define("sv-SE", "FormValidator", {
  required: "FГ¤ltet Г¤r obligatoriskt.",
  minLength: "Ange minst {minLength} tecken (du angav {length} tecken).",
  maxLength: "Ange hГ¶gst {maxLength} tecken (du angav {length} tecken). ",
  integer:
    "Ange ett heltal i fГ¤ltet. Tal med decimaler (t.ex. 1,25) Г¤r inte tillГҐtna.",
  numeric:
    'Ange endast numeriska vГ¤rden i detta fГ¤lt (t.ex. "1" eller "1.1" eller "-1" eller "-1,1").',
  digits:
    "AnvГ¤nd endast siffror och skiljetecken i detta fГ¤lt (till exempel ett telefonnummer med bindestreck tillГҐtet).",
  alpha:
    "AnvГ¤nd endast bokstГ¤ver (a-Г¶) i detta fГ¤lt. Inga mellanslag eller andra tecken Г¤r tillГҐtna.",
  alphanum:
    "AnvГ¤nd endast bokstГ¤ver (a-Г¶) och siffror (0-9) i detta fГ¤lt. Inga mellanslag eller andra tecken Г¤r tillГҐtna.",
  dateSuchAs: "Ange ett giltigt datum som t.ex. {date}",
  dateInFormatMDY:
    'Ange ett giltigt datum som t.ex. YYYY-MM-DD (i.e. "1999-12-31")',
  email: 'Ange en giltig e-postadress. Till exempel "erik@domain.com".',
  url: "Ange en giltig webbadress som http://www.example.com.",
  currencyDollar: "Ange en giltig belopp. Exempelvis 100,00.",
  oneRequired: "VГ¤nligen ange minst ett av dessa alternativ.",
  errorPrefix: "Fel: ",
  warningPrefix: "Varning: ",
  noSpace: "Det fГҐr inte finnas nГҐgra mellanslag i detta fГ¤lt.",
  reqChkByNode: "Inga objekt Г¤r valda.",
  requiredChk: "Detta Г¤r ett obligatoriskt fГ¤lt.",
  reqChkByName: "VГ¤lj en {label}.",
  match: "Detta fГ¤lt mГҐste matcha {matchName}",
  startDate: "startdatumet",
  endDate: "slutdatum",
  currendDate: "dagens datum",
  afterDate: "Datumet bГ¶r vara samma eller senare Г¤n {label}.",
  beforeDate: "Datumet bГ¶r vara samma eller tidigare Г¤n {label}.",
  startMonth: "VГ¤lj en start mГҐnad",
  sameMonth:
    "Dessa tvГҐ datum mГҐste vara i samma mГҐnad - du mГҐste Г¤ndra det ena eller det andra.",
});
(function () {
  var a = function (j, e, c, i, b) {
    var h = (j / 10).toInt(),
      g = j % 10,
      f = (j / 100).toInt();
    if (h == 1 && j > 10) {
      return i;
    }
    if (g == 1) {
      return e;
    }
    if (g > 0 && g < 5) {
      return c;
    }
    return i;
  };
  Locale.define("uk-UA", "Date", {
    months: [
      "РЎС–С‡РµРЅСЊ",
      "Р›СЋС‚РёР№",
      "Р‘РµСЂРµР·РµРЅСЊ",
      "РљРІС–С‚РµРЅСЊ",
      "РўСЂР°РІРµРЅСЊ",
      "Р§РµСЂРІРµРЅСЊ",
      "Р›РёРїРµРЅСЊ",
      "РЎРµСЂРїРµРЅСЊ",
      "Р’РµСЂРµСЃРµРЅСЊ",
      "Р–РѕРІС‚РµРЅСЊ",
      "Р›РёСЃС‚РѕРїР°Рґ",
      "Р“СЂСѓРґРµРЅСЊ",
    ],
    months_abbr: [
      "РЎС–С‡",
      "Р›СЋС‚",
      "Р‘РµСЂ",
      "РљРІС–С‚",
      "РўСЂР°РІ",
      "Р§РµСЂРІ",
      "Р›РёРї",
      "РЎРµСЂРї",
      "Р’РµСЂ",
      "Р–РѕРІС‚",
      "Р›РёСЃС‚",
      "Р“СЂСѓРґ",
    ],
    days: [
      "РќРµРґС–Р»СЏ",
      "РџРѕРЅРµРґС–Р»РѕРє",
      "Р’С–РІС‚РѕСЂРѕРє",
      "РЎРµСЂРµРґР°",
      "Р§РµС‚РІРµСЂ",
      "Рџ'СЏС‚РЅРёС†СЏ",
      "РЎСѓР±РѕС‚Р°",
    ],
    days_abbr: ["РќРґ", "РџРЅ", "Р’С‚", "РЎСЂ", "Р§С‚", "РџС‚", "РЎР±"],
    dateOrder: ["date", "month", "year"],
    shortDate: "%d/%m/%Y",
    shortTime: "%H:%M",
    AM: "РґРѕ РїРѕР»СѓРґРЅСЏ",
    PM: "РїРѕ РїРѕР»СѓРґРЅСЋ",
    firstDayOfWeek: 1,
    ordinal: "",
    lessThanMinuteAgo: "РјРµРЅСЊС€Рµ С…РІРёР»РёРЅРё С‚РѕРјСѓ",
    minuteAgo: "С…РІРёР»РёРЅСѓ С‚РѕРјСѓ",
    minutesAgo: function (b) {
      return (
        "{delta} " +
        a(b, "С…РІРёР»РёРЅСѓ", "С…РІРёР»РёРЅРё", "С…РІРёР»РёРЅ") +
        " С‚РѕРјСѓ"
      );
    },
    hourAgo: "РіРѕРґРёРЅСѓ С‚РѕРјСѓ",
    hoursAgo: function (b) {
      return (
        "{delta} " +
        a(b, "РіРѕРґРёРЅСѓ", "РіРѕРґРёРЅРё", "РіРѕРґРёРЅ") +
        " С‚РѕРјСѓ"
      );
    },
    dayAgo: "РІС‡РѕСЂР°",
    daysAgo: function (b) {
      return "{delta} " + a(b, "РґРµРЅСЊ", "РґРЅСЏ", "РґРЅС–РІ") + " С‚РѕРјСѓ";
    },
    weekAgo: "С‚РёР¶РґРµРЅСЊ С‚РѕРјСѓ",
    weeksAgo: function (b) {
      return (
        "{delta} " +
        a(b, "С‚РёР¶РґРµРЅСЊ", "С‚РёР¶РЅС–", "С‚РёР¶РЅС–РІ") +
        " С‚РѕРјСѓ"
      );
    },
    monthAgo: "РјС–СЃСЏС†СЊ С‚РѕРјСѓ",
    monthsAgo: function (b) {
      return (
        "{delta} " +
        a(b, "РјС–СЃСЏС†СЊ", "РјС–СЃСЏС†С–", "РјС–СЃСЏС†С–РІ") +
        " С‚РѕРјСѓ"
      );
    },
    yearAgo: "СЂС–Рє С‚РѕРјСѓ",
    yearsAgo: function (b) {
      return (
        "{delta} " + a(b, "СЂС–Рє", "СЂРѕРєРё", "СЂРѕРєС–РІ") + " С‚РѕРјСѓ"
      );
    },
    lessThanMinuteUntil: "Р·Р° РјРёС‚СЊ",
    minuteUntil: "С‡РµСЂРµР· С…РІРёР»РёРЅСѓ",
    minutesUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "С…РІРёР»РёРЅСѓ", "С…РІРёР»РёРЅРё", "С…РІРёР»РёРЅ")
      );
    },
    hourUntil: "С‡РµСЂРµР· РіРѕРґРёРЅСѓ",
    hoursUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "РіРѕРґРёРЅСѓ", "РіРѕРґРёРЅРё", "РіРѕРґРёРЅ")
      );
    },
    dayUntil: "Р·Р°РІС‚СЂР°",
    daysUntil: function (b) {
      return "С‡РµСЂРµР· {delta} " + a(b, "РґРµРЅСЊ", "РґРЅСЏ", "РґРЅС–РІ");
    },
    weekUntil: "С‡РµСЂРµР· С‚РёР¶РґРµРЅСЊ",
    weeksUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "С‚РёР¶РґРµРЅСЊ", "С‚РёР¶РЅС–", "С‚РёР¶РЅС–РІ")
      );
    },
    monthUntil: "С‡РµСЂРµР· РјС–СЃСЏС†СЊ",
    monthesUntil: function (b) {
      return (
        "С‡РµСЂРµР· {delta} " +
        a(b, "РјС–СЃСЏС†СЊ", "РјС–СЃСЏС†С–", "РјС–СЃСЏС†С–РІ")
      );
    },
    yearUntil: "С‡РµСЂРµР· СЂС–Рє",
    yearsUntil: function (b) {
      return "С‡РµСЂРµР· {delta} " + a(b, "СЂС–Рє", "СЂРѕРєРё", "СЂРѕРєС–РІ");
    },
  });
})();
Locale.define("uk-UA", "FormValidator", {
  required: "Р¦Рµ РїРѕР»Рµ РїРѕРІРёРЅРЅРµ Р±СѓС‚Рё Р·Р°РїРѕРІРЅРµРЅРёРј.",
  minLength:
    "Р’РІРµРґС–С‚СЊ С…РѕС‡Р° Р± {minLength} СЃРёРјРІРѕР»С–РІ (Р’Рё РІРІРµР»Рё {length}).",
  maxLength:
    "РљС–Р»СЊРєС–СЃС‚СЊ СЃРёРјРІРѕР»С–РІ РЅРµ РјРѕР¶Рµ Р±СѓС‚Рё Р±С–Р»СЊС€Рµ {maxLength} (Р’Рё РІРІРµР»Рё {length}).",
  integer:
    "Р’РІРµРґС–С‚СЊ РІ С†Рµ РїРѕР»Рµ С‡РёСЃР»Рѕ. Р”СЂРѕР±РѕРІС– С‡РёСЃР»Р° (РЅР°РїСЂРёРєР»Р°Рґ 1.25) РЅРµ РґРѕР·РІРѕР»РµРЅС–.",
  numeric:
    'Р’РІРµРґС–С‚СЊ РІ С†Рµ РїРѕР»Рµ С‡РёСЃР»Рѕ (РЅР°РїСЂРёРєР»Р°Рґ "1" Р°Р±Рѕ "1.1", Р°Р±Рѕ "-1", Р°Р±Рѕ "-1.1").',
  digits:
    "Р’ С†СЊРѕРјСѓ РїРѕР»С– РІРё РјРѕР¶РµС‚Рµ РІРёРєРѕСЂРёСЃС‚РѕРІСѓРІР°С‚Рё Р»РёС€Рµ С†РёС„СЂРё С– Р·РЅР°РєРё РїСѓРЅРєС‚С–Р°С†С–С— (РЅР°РїСЂРёРєР»Р°Рґ, С‚РµР»РµС„РѕРЅРЅРёР№ РЅРѕРјРµСЂ Р· Р·РЅР°РєР°РјРё РґРµС„С–Р·Сѓ Р°Р±Рѕ Р· РєСЂР°РїРєР°РјРё).",
  alpha:
    "Р’ С†СЊРѕРјСѓ РїРѕР»С– РјРѕР¶РЅР° РІРёРєРѕСЂРёСЃС‚РѕРІСѓРІР°С‚Рё Р»РёС€Рµ Р»Р°С‚РёРЅСЃСЊРєС– Р»С–С‚РµСЂРё (a-z). РџСЂРѕР±С–Р»Рё С– С–РЅС€С– СЃРёРјРІРѕР»Рё Р·Р°Р±РѕСЂРѕРЅРµРЅС–.",
  alphanum:
    "Р’ С†СЊРѕРјСѓ РїРѕР»С– РјРѕР¶РЅР° РІРёРєРѕСЂРёСЃС‚РѕРІСѓРІР°С‚Рё Р»РёС€Рµ Р»Р°С‚РёРЅСЃСЊРєС– Р»С–С‚РµСЂРё (a-z) С– С†РёС„СЂРё (0-9). РџСЂРѕР±С–Р»Рё С– С–РЅС€С– СЃРёРјРІРѕР»Рё Р·Р°Р±РѕСЂРѕРЅРµРЅС–.",
  dateSuchAs: "Р’РІРµРґС–С‚СЊ РєРѕСЂРµРєС‚РЅСѓ РґР°С‚Сѓ {date}.",
  dateInFormatMDY:
    'Р’РІРµРґС–С‚СЊ РґР°С‚Сѓ РІ С„РѕСЂРјР°С‚С– РњРњ/Р”Р”/Р Р Р Р  (РЅР°РїСЂРёРєР»Р°Рґ "12/31/2009").',
  email:
    'Р’РІРµРґС–С‚СЊ РєРѕСЂРµРєС‚РЅСѓ Р°РґСЂРµСЃСѓ РµР»РµРєС‚СЂРѕРЅРЅРѕС— РїРѕС€С‚Рё (РЅР°РїСЂРёРєР»Р°Рґ "name@domain.com").',
  url: "Р’РІРµРґС–С‚СЊ РєРѕСЂРµРєС‚РЅРµ С–РЅС‚РµСЂРЅРµС‚-РїРѕСЃРёР»Р°РЅРЅСЏ (РЅР°РїСЂРёРєР»Р°Рґ http://www.example.com).",
  currencyDollar:
    'Р’РІРµРґС–С‚СЊ СЃСѓРјСѓ РІ РґРѕР»Р°СЂР°С… (РЅР°РїСЂРёРєР»Р°Рґ "$100.00").',
  oneRequired: "Р—Р°РїРѕРІРЅС–С‚СЊ РѕРґРЅРµ Р· РїРѕР»С–РІ.",
  errorPrefix: "РџРѕРјРёР»РєР°: ",
  warningPrefix: "РЈРІР°РіР°: ",
  noSpace: "РџСЂРѕР±С–Р»Рё Р·Р°Р±РѕСЂРѕРЅРµРЅС–.",
  reqChkByNode: "РќРµ РІС–РґРјС–С‡РµРЅРѕ Р¶РѕРґРЅРѕРіРѕ РІР°СЂС–Р°РЅС‚Сѓ.",
  requiredChk: "Р¦Рµ РїРѕР»Рµ РїРѕРІРёРЅРЅРµ Р±СѓС‚Рё РІС–РјС–С‡РµРЅРёРј.",
  reqChkByName: "Р‘СѓРґСЊ Р»Р°СЃРєР°, РІС–РґРјС–С‚СЊС‚Рµ {label}.",
  match: "Р¦Рµ РїРѕР»Рµ РїРѕРІРёРЅРЅРѕ РІС–РґРїРѕРІС–РґР°С‚Рё {matchName}",
  startDate: "РїРѕС‡Р°С‚РєРѕРІР° РґР°С‚Р°",
  endDate: "РєС–РЅС†РµРІР° РґР°С‚Р°",
  currendDate: "СЃСЊРѕРіРѕРґРЅС–С€РЅСЏ РґР°С‚Р°",
  afterDate:
    "Р¦СЏ РґР°С‚Р° РїРѕРІРёРЅРЅР° Р±СѓС‚Рё С‚Р°РєРѕСЋ Р¶, Р°Р±Рѕ РїС–Р·РЅС–С€РѕСЋ Р·Р° {label}.",
  beforeDate:
    "Р¦СЏ РґР°С‚Р° РїРѕРІРёРЅРЅР° Р±СѓС‚Рё С‚Р°РєРѕСЋ Р¶, Р°Р±Рѕ СЂР°РЅС–С€РѕСЋ Р·Р° {label}.",
  startMonth:
    "Р‘СѓРґСЊ Р»Р°СЃРєР°, РІРёР±РµСЂС–С‚СЊ РїРѕС‡Р°С‚РєРѕРІРёР№ РјС–СЃСЏС†СЊ",
  sameMonth:
    "Р¦С– РґР°С‚Рё РїРѕРІРёРЅРЅС– РІС–РґРЅРѕСЃРёС‚РёСЃСЊ РѕРґРЅРѕРіРѕ С– С‚РѕРіРѕ Р¶ РјС–СЃСЏС†СЏ. Р‘СѓРґСЊ Р»Р°СЃРєР°, Р·РјС–РЅС–С‚СЊ РѕРґРЅСѓ Р· РЅРёС….",
  creditcard:
    "РќРѕРјРµСЂ РєСЂРµРґРёС‚РЅРѕС— РєР°СЂС‚Рё РІРІРµРґРµРЅРёР№ РЅРµРїСЂР°РІРёР»СЊРЅРѕ. Р‘СѓРґСЊ Р»Р°СЃРєР°, РїРµСЂРµРІС–СЂС‚Рµ Р№РѕРіРѕ. Р’РІРµРґРµРЅРѕ {length} СЃРёРјРІРѕР»С–РІ.",
});
Locale.define("zh-CHS", "Date", {
  months: [
    "дёЂжњ€",
    "дєЊжњ€",
    "дё‰жњ€",
    "е››жњ€",
    "дє”жњ€",
    "е…­жњ€",
    "дёѓжњ€",
    "е…«жњ€",
    "д№ќжњ€",
    "еЌЃжњ€",
    "еЌЃдёЂжњ€",
    "еЌЃдєЊжњ€",
  ],
  months_abbr: [
    "дёЂ",
    "дєЊ",
    "дё‰",
    "е››",
    "дє”",
    "е…­",
    "дёѓ",
    "е…«",
    "д№ќ",
    "еЌЃ",
    "еЌЃдёЂ",
    "еЌЃдєЊ",
  ],
  days: [
    "жџжњџж—Ґ",
    "жџжњџдёЂ",
    "жџжњџдєЊ",
    "жџжњџдё‰",
    "жџжњџе››",
    "жџжњџдє”",
    "жџжњџе…­",
  ],
  days_abbr: ["ж—Ґ", "дёЂ", "дєЊ", "дё‰", "е››", "дє”", "е…­"],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y-%m-%d",
  shortTime: "%I:%M%p",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "",
  lessThanMinuteAgo: "дёЌе€°1е€†й’џе‰Ќ",
  minuteAgo: "е¤§зє¦1е€†й’џе‰Ќ",
  minutesAgo: "{delta}е€†й’џд№‹е‰Ќ",
  hourAgo: "е¤§зє¦1е°Џж—¶е‰Ќ",
  hoursAgo: "е¤§зє¦{delta}е°Џж—¶е‰Ќ",
  dayAgo: "1е¤©е‰Ќ",
  daysAgo: "{delta}е¤©е‰Ќ",
  weekAgo: "1жџжњџе‰Ќ",
  weeksAgo: "{delta}жџжњџе‰Ќ",
  monthAgo: "1дёЄжњ€е‰Ќ",
  monthsAgo: "{delta}дёЄжњ€е‰Ќ",
  yearAgo: "1е№ґе‰Ќ",
  yearsAgo: "{delta}е№ґе‰Ќ",
  lessThanMinuteUntil: "д»ЋзЋ°ењЁејЂе§‹дёЌе€°1е€†й’џ",
  minuteUntil: "д»ЋзЋ°ењЁејЂе§‹зґ„1е€†й’џ",
  minutesUntil: "д»ЋзЋ°ењЁејЂе§‹зє¦{delta}е€†й’џ",
  hourUntil: "д»ЋзЋ°ењЁејЂе§‹1е°Џж—¶",
  hoursUntil: "д»ЋзЋ°ењЁејЂе§‹зє¦{delta}е°Џж—¶",
  dayUntil: "д»ЋзЋ°ењЁејЂе§‹1е¤©",
  daysUntil: "д»ЋзЋ°ењЁејЂе§‹{delta}е¤©",
  weekUntil: "д»ЋзЋ°ењЁејЂе§‹1жџжњџ",
  weeksUntil: "д»ЋзЋ°ењЁејЂе§‹{delta}жџжњџ",
  monthUntil: "д»ЋзЋ°ењЁејЂе§‹дёЂдёЄжњ€",
  monthsUntil: "д»ЋзЋ°ењЁејЂе§‹{delta}дёЄжњ€",
  yearUntil: "д»ЋзЋ°ењЁејЂе§‹1е№ґ",
  yearsUntil: "д»ЋзЋ°ењЁејЂе§‹{delta}е№ґ",
});
Locale.define("zh-CHT", "Date", {
  months: [
    "дёЂжњ€",
    "дєЊжњ€",
    "дё‰жњ€",
    "е››жњ€",
    "дє”жњ€",
    "е…­жњ€",
    "дёѓжњ€",
    "е…«жњ€",
    "д№ќжњ€",
    "еЌЃжњ€",
    "еЌЃдёЂжњ€",
    "еЌЃдєЊжњ€",
  ],
  months_abbr: [
    "дёЂ",
    "дєЊ",
    "дё‰",
    "е››",
    "дє”",
    "е…­",
    "дёѓ",
    "е…«",
    "д№ќ",
    "еЌЃ",
    "еЌЃдёЂ",
    "еЌЃдєЊ",
  ],
  days: [
    "жџжњџж—Ґ",
    "жџжњџдёЂ",
    "жџжњџдєЊ",
    "жџжњџдё‰",
    "жџжњџе››",
    "жџжњџдє”",
    "жџжњџе…­",
  ],
  days_abbr: ["ж—Ґ", "дёЂ", "дєЊ", "дё‰", "е››", "дє”", "е…­"],
  dateOrder: ["year", "month", "date"],
  shortDate: "%Y-%m-%d",
  shortTime: "%I:%M%p",
  AM: "AM",
  PM: "PM",
  firstDayOfWeek: 1,
  ordinal: "",
  lessThanMinuteAgo: "дёЌе€°1е€†йђе‰Ќ",
  minuteAgo: "е¤§зґ„1е€†йђе‰Ќ",
  minutesAgo: "{delta}е€†йђд№‹е‰Ќ",
  hourAgo: "е¤§зґ„1е°Џж™‚е‰Ќ",
  hoursAgo: "е¤§зґ„{delta}е°Џж™‚е‰Ќ",
  dayAgo: "1е¤©е‰Ќ",
  daysAgo: "{delta}е¤©е‰Ќ",
  weekAgo: "1жџжњџе‰Ќ",
  weeksAgo: "{delta}жџжњџе‰Ќ",
  monthAgo: "1дёЄжњ€е‰Ќ",
  monthsAgo: "{delta}дёЄжњ€е‰Ќ",
  yearAgo: "1е№ґе‰Ќ",
  yearsAgo: "{delta}е№ґе‰Ќ",
  lessThanMinuteUntil: "еѕћзЏѕењЁй–‹е§‹дёЌе€°1е€†йђ",
  minuteUntil: "еѕћзЏѕењЁй–‹е§‹зґ„1е€†йђ",
  minutesUntil: "еѕћзЏѕењЁй–‹е§‹зґ„{delta}е€†йђ",
  hourUntil: "еѕћзЏѕењЁй–‹е§‹1е°Џж™‚",
  hoursUntil: "еѕћзЏѕењЁй–‹е§‹зґ„{delta}е°Џж™‚",
  dayUntil: "еѕћзЏѕењЁй–‹е§‹1е¤©",
  daysUntil: "еѕћзЏѕењЁй–‹е§‹{delta}е¤©",
  weekUntil: "еѕћзЏѕењЁй–‹е§‹1жџжњџ",
  weeksUntil: "еѕћзЏѕењЁй–‹е§‹{delta}жџжњџ",
  monthUntil: "еѕћзЏѕењЁй–‹е§‹дёЂеЂ‹жњ€",
  monthsUntil: "еѕћзЏѕењЁй–‹е§‹{delta}еЂ‹жњ€",
  yearUntil: "еѕћзЏѕењЁй–‹е§‹1е№ґ",
  yearsUntil: "еѕћзЏѕењЁй–‹е§‹{delta}е№ґ",
});
Locale.define("zh-CHS", "FormValidator", {
  required: "ж­¤йЎ№еї…еЎ«гЂ‚",
  minLength:
    "иЇ·и‡іе°‘иѕ“е…Ґ {minLength} дёЄе­—з¬¦ (е·Іиѕ“е…Ґ {length} дёЄ)гЂ‚",
  maxLength:
    "жњЂе¤љеЏЄиѓЅиѕ“е…Ґ {maxLength} дёЄе­—з¬¦ (е·Іиѕ“е…Ґ {length} дёЄ)гЂ‚",
  integer:
    'иЇ·иѕ“е…ҐдёЂдёЄж•ґж•°пјЊдёЌиѓЅеЊ…еђ«е°Џж•°з‚№гЂ‚дѕ‹е¦‚пјљ"1", "200"гЂ‚',
  numeric: 'иЇ·иѕ“е…ҐдёЂдёЄж•°е­—пјЊдѕ‹е¦‚пјљ"1", "1.1", "-1", "-1.1"гЂ‚',
  digits:
    "иЇ·иѕ“е…Ґз”±ж•°е­—е’Њж ‡з‚№з¬¦еЏ·з»„ж€ђзљ„е†…е®№гЂ‚дѕ‹е¦‚з”µиЇќеЏ·з ЃгЂ‚",
  alpha:
    "иЇ·иѕ“е…Ґ A-Z зљ„ 26 дёЄе­—жЇЌпјЊдёЌиѓЅеЊ…еђ«з©єж јж€–д»»дЅ•е…¶д»–е­—з¬¦гЂ‚",
  alphanum:
    "иЇ·иѕ“е…Ґ A-Z зљ„ 26 дёЄе­—жЇЌж€– 0-9 зљ„ 10 дёЄж•°е­—пјЊдёЌиѓЅеЊ…еђ«з©єж јж€–д»»дЅ•е…¶д»–е­—з¬¦гЂ‚",
  dateSuchAs: "иЇ·иѕ“е…Ґеђ€жі•зљ„ж—Ґжњџж јејЏпјЊе¦‚пјљ{date}гЂ‚",
  dateInFormatMDY:
    'иЇ·иѕ“е…Ґеђ€жі•зљ„ж—Ґжњџж јејЏпјЊдѕ‹е¦‚пјљYYYY-MM-DD ("2010-12-31")гЂ‚',
  email: 'иЇ·иѕ“е…Ґеђ€жі•зљ„з”µе­ђдїЎз®±ењ°еќЂпјЊдѕ‹е¦‚пјљ"fred@domain.com"гЂ‚',
  url: "иЇ·иѕ“е…Ґеђ€жі•зљ„ Url ењ°еќЂпјЊдѕ‹е¦‚пјљhttp://www.example.comгЂ‚",
  currencyDollar: "иЇ·иѕ“е…Ґеђ€жі•зљ„иґ§еёЃз¬¦еЏ·пјЊдѕ‹е¦‚пјљпїҐ100.0",
  oneRequired: "иЇ·и‡іе°‘йЂ‰ж‹©дёЂйЎ№гЂ‚",
  errorPrefix: "й”™иЇЇпјљ",
  warningPrefix: "и­¦е‘Љпјљ",
  noSpace: "дёЌиѓЅеЊ…еђ«з©єж јгЂ‚",
  reqChkByNode: "жњЄйЂ‰ж‹©д»»дЅ•е†…е®№гЂ‚",
  requiredChk: "ж­¤йЎ№еї…еЎ«гЂ‚",
  reqChkByName: "иЇ·йЂ‰ж‹© {label}.",
  match: "еї…йЎ»дёЋ{matchName}з›ёеЊ№й…Ќ",
  startDate: "иµ·е§‹ж—Ґжњџ",
  endDate: "з»“жќџж—Ґжњџ",
  currendDate: "еЅ“е‰Ќж—Ґжњџ",
  afterDate: "ж—Ґжњџеї…йЎ»з­‰дєЋж€–ж™љдєЋ {label}.",
  beforeDate: "ж—Ґжњџеї…йЎ»ж—©дєЋж€–з­‰дєЋ {label}.",
  startMonth: "иЇ·йЂ‰ж‹©иµ·е§‹жњ€д»Ѕ",
  sameMonth:
    "ж‚Ёеї…йЎ»дї®ж”№дё¤дёЄж—Ґжњџдё­зљ„дёЂдёЄпјЊд»ҐзЎ®дїќе®ѓд»¬ењЁеђЊдёЂжњ€д»ЅгЂ‚",
  creditcard:
    "ж‚Ёиѕ“е…Ґзљ„дїЎз”ЁеЌЎеЏ·з ЃдёЌж­ЈзЎ®гЂ‚еЅ“е‰Ќе·Іиѕ“е…Ґ{length}дёЄе­—з¬¦гЂ‚",
});
Locale.define("zh-CHT", "FormValidator", {
  required: "ж­¤й …еї…еЎ«гЂ‚ ",
  minLength: "и«‹и‡іе°‘ијёе…Ґ{minLength} еЂ‹е­—з¬¦(е·Іијёе…Ґ{length} еЂ‹)гЂ‚ ",
  maxLength:
    "жњЂе¤љеЏЄиѓЅијёе…Ґ{maxLength} еЂ‹е­—з¬¦(е·Іијёе…Ґ{length} еЂ‹)гЂ‚ ",
  integer:
    'и«‹ијёе…ҐдёЂеЂ‹ж•ґж•ёпјЊдёЌиѓЅеЊ…еђ«е°Џж•ёй»ћгЂ‚дѕ‹е¦‚пјљ"1", "200"гЂ‚ ',
  numeric: 'и«‹ијёе…ҐдёЂеЂ‹ж•ёе­—пјЊдѕ‹е¦‚пјљ"1", "1.1", "-1", "-1.1"гЂ‚ ',
  digits:
    "и«‹ијёе…Ґз”±ж•ёе­—е’ЊжЁ™й»ћз¬¦и™џзµ„ж€ђзљ„е…§е®№гЂ‚дѕ‹е¦‚й›»и©±и™џзўјгЂ‚ ",
  alpha:
    "и«‹ијёе…ҐAZ зљ„26 еЂ‹е­—жЇЌпјЊдёЌиѓЅеЊ…еђ«з©єж јж€–д»»дЅ•е…¶д»–е­—з¬¦гЂ‚ ",
  alphanum:
    "и«‹ијёе…ҐAZ зљ„26 еЂ‹е­—жЇЌж€–0-9 зљ„10 еЂ‹ж•ёе­—пјЊдёЌиѓЅеЊ…еђ«з©єж јж€–д»»дЅ•е…¶д»–е­—з¬¦гЂ‚ ",
  dateSuchAs: "и«‹ијёе…Ґеђ€жі•зљ„ж—Ґжњџж јејЏпјЊе¦‚пјљ{date}гЂ‚ ",
  dateInFormatMDY:
    'и«‹ијёе…Ґеђ€жі•зљ„ж—Ґжњџж јејЏпјЊдѕ‹е¦‚пјљYYYY-MM-DD ("2010-12-31")гЂ‚ ',
  email:
    'и«‹ијёе…Ґеђ€жі•зљ„й›»е­ђдїЎз®±ењ°еќЂпјЊдѕ‹е¦‚пјљ"fred@domain.com"гЂ‚ ',
  url: "и«‹ијёе…Ґеђ€жі•зљ„Url ењ°еќЂпјЊдѕ‹е¦‚пјљhttp://www.example.comгЂ‚ ",
  currencyDollar: "и«‹ијёе…Ґеђ€жі•зљ„иІЁе№Јз¬¦и™џпјЊдѕ‹е¦‚пјљпїҐ100.0",
  oneRequired: "и«‹и‡іе°‘йЃёж“‡дёЂй …гЂ‚ ",
  errorPrefix: "йЊЇиЄ¤пјљ",
  warningPrefix: "и­¦е‘Љпјљ",
  noSpace: "дёЌиѓЅеЊ…еђ«з©єж јгЂ‚ ",
  reqChkByNode: "жњЄйЃёж“‡д»»дЅ•е…§е®№гЂ‚ ",
  requiredChk: "ж­¤й …еї…еЎ«гЂ‚ ",
  reqChkByName: "и«‹йЃёж“‡ {label}.",
  match: "еї…й €и€‡{matchName}з›ёеЊ№й…Ќ",
  startDate: "иµ·е§‹ж—Ґжњџ",
  endDate: "зµђжќџж—Ґжњџ",
  currendDate: "з•¶е‰Ќж—Ґжњџ",
  afterDate: "ж—Ґжњџеї…й €з­‰ж–јж€–ж™љж–ј{label}.",
  beforeDate: "ж—Ґжњџеї…й €ж—©ж–јж€–з­‰ж–ј{label}.",
  startMonth: "и«‹йЃёж“‡иµ·е§‹жњ€д»Ѕ",
  sameMonth:
    "ж‚Ёеї…й €дї®ж”№е…©еЂ‹ж—Ґжњџдё­зљ„дёЂеЂ‹пјЊд»Ґзўєдїќе®ѓеЂ‘ењЁеђЊдёЂжњ€д»ЅгЂ‚ ",
  creditcard:
    "ж‚Ёијёе…Ґзљ„дїЎз”ЁеЌЎи™џзўјдёЌж­ЈзўєгЂ‚з•¶е‰Ќе·Іијёе…Ґ{length}еЂ‹е­—з¬¦гЂ‚ ",
});
Form.Validator.add("validate-currency-yuan", {
  errorMsg: function () {
    return Form.Validator.getMsg("currencyYuan");
  },
  test: function (a) {
    return (
      Form.Validator.getValidator("IsEmpty").test(a) ||
      /^пїҐ?\-?([1-9]{1}[0-9]{0,2}(\,[0-9]{3})*(\.[0-9]{0,2})?|[1-9]{1}\d*(\.[0-9]{0,2})?|0(\.[0-9]{0,2})?|(\.[0-9]{1,2})?)$/.test(
        a.get("value")
      )
    );
  },
});
