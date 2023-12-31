!function t(e, i, n) {
    function r(o, s) {
        if (!i[o]) {
            if (!e[o]) {
                var l = "function" == typeof require && require;
                if (!s && l)
                    return l(o, !0);
                if (a)
                    return a(o, !0);
                var u = new Error("Cannot find module '" + o + "'");
                throw u.code = "MODULE_NOT_FOUND",
                u
            }
            var d = i[o] = {
                exports: {}
            };
            e[o][0].call(d.exports, function(t) {
                var i = e[o][1][t];
                return r(i ? i : t)
            }, d, d.exports, t, e, i, n)
        }
        return i[o].exports
    }
    for (var a = "function" == typeof require && require, o = 0; o < n.length; o++)
        r(n[o]);
    return r
}({
    1: [function(t, e, i) {
        e.exports = {
            DEV_ID: "i5iSjo"
        }
    }
    , {}],
    2: [function(t, e, i) {
        function n(t, e) {
            if (window.addEventListener) {
                this.opts = a(e, {
                    attributePrefix: "data-"
                }),
                this.tracker = t;
                var i = this.opts.attributePrefix
                  , n = "[" + i + "event-category][" + i + "event-action]";
                this.delegate = r(document, n, "click", this.handleEventClicks.bind(this))
            }
        }
        var r = t("delegate")
          , a = t("../utilities").defaults
          , o = t("../provide");
        n.prototype.handleEventClicks = function(t) {
            var e = t.delegateTarget
              , i = this.opts.attributePrefix;
            this.tracker.send("event", {
                eventCategory: e.getAttribute(i + "event-category"),
                eventAction: e.getAttribute(i + "event-action"),
                eventLabel: e.getAttribute(i + "event-label"),
                eventValue: e.getAttribute(i + "event-value")
            })
        }
        ,
        n.prototype.remove = function() {
            this.delegate.destroy(),
            this.delegate = null,
            this.tracker = null,
            this.opts = null
        }
        ,
        o("eventTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9,
        delegate: 13
    }],
    3: [function(t, e, i) {
        function n(t, e) {
            window.matchMedia && (this.opts = o(e, {
                mediaQueryDefinitions: !1,
                mediaQueryChangeTemplate: this.changeTemplate,
                mediaQueryChangeTimeout: 1e3
            }),
            s(this.opts.mediaQueryDefinitions) && (this.opts.mediaQueryDefinitions = l(this.opts.mediaQueryDefinitions),
            this.tracker = t,
            this.changeListeners = [],
            this.processMediaQueries()))
        }
        function r(t) {
            return c[t] ? c[t] : (c[t] = window.matchMedia(t),
            c[t])
        }
        var a = t("debounce")
          , o = t("../utilities").defaults
          , s = t("../utilities").isObject
          , l = t("../utilities").toArray
          , u = t("../provide")
          , d = "(not set)"
          , c = {};
        n.prototype.processMediaQueries = function() {
            this.opts.mediaQueryDefinitions.forEach(function(t) {
                if (t.name && t.dimensionIndex) {
                    var e = this.getMatchName(t);
                    this.tracker.set("dimension" + t.dimensionIndex, e),
                    this.addChangeListeners(t)
                }
            }
            .bind(this))
        }
        ,
        n.prototype.getMatchName = function(t) {
            var e;
            return t.items.forEach(function(t) {
                r(t.media).matches && (e = t)
            }),
            e ? e.name : d
        }
        ,
        n.prototype.addChangeListeners = function(t) {
            t.items.forEach(function(e) {
                var i = r(e.media)
                  , n = a(function() {
                    this.handleChanges(t)
                }
                .bind(this), this.opts.mediaQueryChangeTimeout);
                i.addListener(n),
                this.changeListeners.push({
                    mql: i,
                    fn: n
                })
            }
            .bind(this))
        }
        ,
        n.prototype.handleChanges = function(t) {
            var e = this.getMatchName(t)
              , i = this.tracker.get("dimension" + t.dimensionIndex);
            e !== i && (this.tracker.set("dimension" + t.dimensionIndex, e),
            this.tracker.send("event", t.name, "change", this.opts.mediaQueryChangeTemplate(i, e)))
        }
        ,
        n.prototype.remove = function() {
            for (var t, e = 0; t = this.changeListeners[e]; e++)
                t.mql.removeListener(t.fn);
            this.changeListeners = null,
            this.tracker = null,
            this.opts = null
        }
        ,
        n.prototype.changeTemplate = function(t, e) {
            return t + " => " + e
        }
        ,
        u("mediaQueryTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9,
        debounce: 12
    }],
    4: [function(t, e, i) {
        function n(t, e) {
            window.addEventListener && (this.opts = r(e, {
                shouldTrackOutboundForm: this.shouldTrackOutboundForm
            }),
            this.tracker = t,
            this.delegate = a(document, "form", "submit", this.handleFormSubmits.bind(this)))
        }
        var r = t("../utilities").defaults
          , a = t("delegate")
          , o = t("../provide")
          , s = t("../utilities");
        n.prototype.handleFormSubmits = function(t) {
            var e = t.delegateTarget
              , i = e.getAttribute("action")
              , n = {
                transport: "beacon"
            };
            this.opts.shouldTrackOutboundForm(e) && (navigator.sendBeacon || (t.preventDefault(),
            n.hitCallback = s.withTimeout(function() {
                e.submit()
            })),
            this.tracker.send("event", "Outbound Form", "submit", i, n))
        }
        ,
        n.prototype.shouldTrackOutboundForm = function(t) {
            var e = t.getAttribute("action");
            return e && 0 === e.indexOf("http") && e.indexOf(location.hostname) < 0
        }
        ,
        n.prototype.remove = function() {
            this.delegate.destroy(),
            this.delegate = null,
            this.tracker = null,
            this.opts = null
        }
        ,
        o("outboundFormTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9,
        delegate: 13
    }],
    5: [function(t, e, i) {
        function n(t, e) {
            window.addEventListener && (this.opts = r(e, {
                shouldTrackOutboundLink: this.shouldTrackOutboundLink
            }),
            this.tracker = t,
            this.delegate = a(document, "a", "click", this.handleLinkClicks.bind(this)))
        }
        var r = t("../utilities").defaults
          , a = t("delegate")
          , o = t("../provide");
        n.prototype.handleLinkClicks = function(t) {
            var e = t.delegateTarget;
            this.opts.shouldTrackOutboundLink(e) && (navigator.sendBeacon || (e.target = "_blank"),
            this.tracker.send("event", "Outbound Link", "click", e.href, {
                transport: "beacon"
            }))
        }
        ,
        n.prototype.shouldTrackOutboundLink = function(t) {
            return t.hostname != location.hostname && 0 === t.protocol.indexOf("http")
        }
        ,
        n.prototype.remove = function() {
            this.delegate.destroy(),
            this.delegate = null,
            this.tracker = null,
            this.opts = null
        }
        ,
        o("outboundLinkTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9,
        delegate: 13
    }],
    6: [function(t, e, i) {
        function n(t, e) {
            if (window.addEventListener) {
                this.opts = r(e, {
                    attributePrefix: "data-"
                }),
                this.tracker = t;
                var i = this.opts.attributePrefix
                  , n = "[" + i + "social-network][" + i + "social-action][" + i + "social-target]";
                this.handleSocialClicks = this.handleSocialClicks.bind(this),
                this.addWidgetListeners = this.addWidgetListeners.bind(this),
                this.addTwitterEventHandlers = this.addTwitterEventHandlers.bind(this),
                this.handleTweetEvents = this.handleTweetEvents.bind(this),
                this.handleFollowEvents = this.handleFollowEvents.bind(this),
                this.handleLikeEvents = this.handleLikeEvents.bind(this),
                this.handleUnlikeEvents = this.handleUnlikeEvents.bind(this),
                this.delegate = a(document, n, "click", this.handleSocialClicks),
                "complete" != document.readyState ? window.addEventListener("load", this.addWidgetListeners) : this.addWidgetListeners()
            }
        }
        var r = t("../utilities").defaults
          , a = t("delegate")
          , o = t("../provide");
        n.prototype.addWidgetListeners = function() {
            window.FB && this.addFacebookEventHandlers(),
            window.twttr && this.addTwitterEventHandlers()
        }
        ,
        n.prototype.handleSocialClicks = function(t) {
            var e = t.delegateTarget
              , i = this.opts.attributePrefix;
            this.tracker.send("social", {
                socialNetwork: e.getAttribute(i + "social-network"),
                socialAction: e.getAttribute(i + "social-action"),
                socialTarget: e.getAttribute(i + "social-target")
            })
        }
        ,
        n.prototype.addTwitterEventHandlers = function() {
            try {
                twttr.ready(function() {
                    twttr.events.bind("tweet", this.handleTweetEvents),
                    twttr.events.bind("follow", this.handleFollowEvents)
                }
                .bind(this))
            } catch (t) {}
        }
        ,
        n.prototype.removeTwitterEventHandlers = function() {
            try {
                twttr.ready(function() {
                    twttr.events.unbind("tweet", this.handleTweetEvents),
                    twttr.events.unbind("follow", this.handleFollowEvents)
                }
                .bind(this))
            } catch (t) {}
        }
        ,
        n.prototype.addFacebookEventHandlers = function() {
            try {
                FB.Event.subscribe("edge.create", this.handleLikeEvents),
                FB.Event.subscribe("edge.remove", this.handleUnlikeEvents)
            } catch (t) {}
        }
        ,
        n.prototype.removeFacebookEventHandlers = function() {
            try {
                FB.Event.unsubscribe("edge.create", this.handleLikeEvents),
                FB.Event.unsubscribe("edge.remove", this.handleUnlikeEvents)
            } catch (t) {}
        }
        ,
        n.prototype.handleTweetEvents = function(t) {
            if ("tweet" == t.region) {
                var e = t.data.url || t.target.getAttribute("data-url") || location.href;
                this.tracker.send("social", "Twitter", "tweet", e)
            }
        }
        ,
        n.prototype.handleFollowEvents = function(t) {
            if ("follow" == t.region) {
                var e = t.data.screen_name || t.target.getAttribute("data-screen-name");
                this.tracker.send("social", "Twitter", "follow", e)
            }
        }
        ,
        n.prototype.handleLikeEvents = function(t) {
            this.tracker.send("social", "Facebook", "like", t)
        }
        ,
        n.prototype.handleUnlikeEvents = function(t) {
            this.tracker.send("social", "Facebook", "unlike", t)
        }
        ,
        n.prototype.remove = function() {
            window.removeEventListener("load", this.addWidgetListeners),
            this.removeFacebookEventHandlers(),
            this.removeTwitterEventHandlers(),
            this.delegate.destroy(),
            this.delegate = null,
            this.tracker = null,
            this.opts = null,
            this.handleSocialClicks = null,
            this.addWidgetListeners = null,
            this.addTwitterEventHandlers = null,
            this.handleTweetEvents = null,
            this.handleFollowEvents = null,
            this.handleLikeEvents = null,
            this.handleUnlikeEvents = null
        }
        ,
        o("socialTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9,
        delegate: 13
    }],
    7: [function(t, e, i) {
        function n(t, e) {
            history.pushState && window.addEventListener && (this.opts = a(e, {
                shouldTrackUrlChange: this.shouldTrackUrlChange
            }),
            this.tracker = t,
            this.path = r(),
            this.updateTrackerData = this.updateTrackerData.bind(this),
            this.originalPushState = history.pushState,
            history.pushState = function(t, e) {
                o(t) && e && (t.title = e),
                this.originalPushState.apply(history, arguments),
                this.updateTrackerData()
            }
            .bind(this),
            this.originalReplaceState = history.replaceState,
            history.replaceState = function(t, e) {
                o(t) && e && (t.title = e),
                this.originalReplaceState.apply(history, arguments),
                this.updateTrackerData(!1)
            }
            .bind(this),
            window.addEventListener("popstate", this.updateTrackerData))
        }
        function r() {
            return location.pathname + location.search
        }
        var a = t("../utilities").defaults
          , o = t("../utilities").isObject
          , s = t("../provide");
        n.prototype.updateTrackerData = function(t) {
            t = t !== !1,
            setTimeout(function() {
                var e = this.path
                  , i = r();
                e != i && this.opts.shouldTrackUrlChange.call(this, i, e) && (this.path = i,
                this.tracker.set({
                    page: i,
                    title: o(history.state) && history.state.title || document.title
                }),
                t && this.tracker.send("pageview"))
            }
            .bind(this), 0)
        }
        ,
        n.prototype.shouldTrackUrlChange = function(t, e) {
            return t && e
        }
        ,
        n.prototype.remove = function() {
            window.removeEventListener("popstate", this.updateTrackerData),
            history.replaceState = this.originalReplaceState,
            history.pushState = this.originalPushState,
            this.tracker = null,
            this.opts = null,
            this.path = null,
            this.updateTrackerData = null,
            this.originalReplaceState = null,
            this.originalPushState = null
        }
        ,
        s("urlChangeTracker", n)
    }
    , {
        "../provide": 8,
        "../utilities": 9
    }],
    8: [function(t, e, i) {
        var n = t("./constants")
          , r = t("./utilities");
        (window.gaDevIds = window.gaDevIds || []).push(n.DEV_ID),
        e.exports = function(t, e) {
            var i = window.GoogleAnalyticsObject || "ga";
            window[i] = window[i] || function() {
                (window[i].q = window[i].q || []).push(arguments)
            }
            ,
            window[i]("provide", t, e),
            window.gaplugins = window.gaplugins || {},
            window.gaplugins[r.capitalize(t)] = e
        }
    }
    , {
        "./constants": 1,
        "./utilities": 9
    }],
    9: [function(t, e, i) {
        var n = {
            withTimeout: function(t, e) {
                var i = !1;
                return setTimeout(t, e || 2e3),
                function() {
                    i || (i = !0,
                    t())
                }
            },
            defaults: function(t, e) {
                var i = {};
                "object" != typeof t && (t = {}),
                "object" != typeof e && (e = {});
                for (var n in e)
                    e.hasOwnProperty(n) && (i[n] = t.hasOwnProperty(n) ? t[n] : e[n]);
                return i
            },
            capitalize: function(t) {
                return t.charAt(0).toUpperCase() + t.slice(1)
            },
            isObject: function(t) {
                return "object" == typeof t && null !== t
            },
            isArray: Array.isArray || function(t) {
                return "[object Array]" === Object.prototype.toString.call(t)
            }
            ,
            toArray: function(t) {
                return n.isArray(t) ? t : [t]
            }
        };
        e.exports = n
    }
    , {}],
    10: [function(t, e, i) {
        var n = t("matches-selector");
        e.exports = function(t, e, i) {
            for (var r = i ? t : t.parentNode; r && r !== document; ) {
                if (n(r, e))
                    return r;
                r = r.parentNode
            }
        }
    }
    , {
        "matches-selector": 14
    }],
    11: [function(t, e, i) {
        function n() {
            return (new Date).getTime()
        }
        e.exports = Date.now || n
    }
    , {}],
    12: [function(t, e, i) {
        var n = t("date-now");
        e.exports = function(t, e, i) {
            function r() {
                var d = n() - l;
                e > d && d > 0 ? a = setTimeout(r, e - d) : (a = null,
                i || (u = t.apply(s, o),
                a || (s = o = null)))
            }
            var a, o, s, l, u;
            return null == e && (e = 100),
            function() {
                s = this,
                o = arguments,
                l = n();
                var d = i && !a;
                return a || (a = setTimeout(r, e)),
                d && (u = t.apply(s, o),
                s = o = null),
                u
            }
        }
    }
    , {
        "date-now": 11
    }],
    13: [function(t, e, i) {
        function n(t, e, i, n, a) {
            var o = r.apply(this, arguments);
            return t.addEventListener(i, o, a),
            {
                destroy: function() {
                    t.removeEventListener(i, o, a)
                }
            }
        }
        function r(t, e, i, n) {
            return function(i) {
                i.delegateTarget = a(i.target, e, !0),
                i.delegateTarget && n.call(t, i)
            }
        }
        var a = t("closest");
        e.exports = n
    }
    , {
        closest: 10
    }],
    14: [function(t, e, i) {
        function n(t, e) {
            if (a)
                return a.call(t, e);
            for (var i = t.parentNode.querySelectorAll(e), n = 0; n < i.length; ++n)
                if (i[n] == t)
                    return !0;
            return !1
        }
        var r = Element.prototype
          , a = r.matchesSelector || r.webkitMatchesSelector || r.mozMatchesSelector || r.msMatchesSelector || r.oMatchesSelector;
        e.exports = n
    }
    , {}],
    15: [function(t, e, i) {
        function n(t, e) {
            var i = window[window.GoogleAnalyticsObject || "ga"]
              , n = t.get("name");
            i(n + ".require", "eventTracker", e),
            i(n + ".require", "mediaQueryTracker", e),
            i(n + ".require", "outboundFormTracker", e),
            i(n + ".require", "outboundLinkTracker", e),
            i(n + ".require", "socialTracker", e),
            i(n + ".require", "urlChangeTracker", e)
        }
        t("./event-tracker"),
        t("./media-query-tracker"),
        t("./outbound-form-tracker"),
        t("./outbound-link-tracker"),
        t("./social-tracker"),
        t("./url-change-tracker");
        var r = t("../provide");
        r("autotrack", n)
    }
    , {
        "../provide": 8,
        "./event-tracker": 2,
        "./media-query-tracker": 3,
        "./outbound-form-tracker": 4,
        "./outbound-link-tracker": 5,
        "./social-tracker": 6,
        "./url-change-tracker": 7
    }]
}, {}, [15]);