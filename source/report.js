﻿/// <reference path="intellisense.js" />

var g_bLoaded = false; //needed because DOMContentLoaded gets called again when we modify the page
var g_mapETypeParam = { "ALL": "", "EINCR": 1, "EDECR": -1, "ENEW": 2 };
var g_iTabCur = null; //invalid initially
var ITAB_REPORT = 0;
var ITAB_BYUSER = 1;
var ITAB_BYBOARD = 2;
var ITAB_CHART = 3;
var g_colorDefaultOver = "#B9FFA9";
var g_colorDefaultUnder = "#FFD5BD";
var g_bShowKeywordFilter = false;
var g_bShowLabelsFilter = false;
var KEY_FORMAT_PIVOT_USER = "formatPivotUser";
var KEY_FORMAT_PIVOT_BOARD = "formatPivotBoard";
var KEY_bEnableTrelloSync = "bEnableTrelloSync";
var KEY_bIgnoreZeroECards = "bIgnoreZeroECards";
var keybEnterSEByCardComments = "bEnterSEByCardComments"; //review zig reuse shared globals loader
var keyrgKeywordsforSECardComment = "rgKWFCC";
var g_postFixHeaderLast = " last"; //special postfix for column headers
var g_namedReport = null; //stores named report from initial url param
var g_excludedColumns = {};
var g_bAllowNegativeRemaining = false;

const g_chartViews = { //do not modify existing options, as those could be in saved user's bookmarks
    ser: "ser",
    e1vse : "e1vse",
    echange: "echange",
    cardcount: "cardcount"
};

var g_colours = { //thanks http://stackoverflow.com/a/1573141/2213940
    "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff",
    "beige": "#f5f5dc", "bisque": "#ffe4c4", "black": "#000000", "blanchedalmond": "#ffebcd", "blue": "#0000ff", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887",
    "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "cyan": "#00ffff",
    "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f",
    "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1",
    "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff",
    "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff",
    "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080", "green": "#008000", "greenyellow": "#adff2f",
    "honeydew": "#f0fff0", "hotpink": "#ff69b4",
    "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
    "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2",
    "lightgrey": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de",
    "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32", "linen": "#faf0e6",
    "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee",
    "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5",
    "navajowhite": "#ffdead", "navy": "#000080",
    "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23", "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6",
    "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080",
    "red": "#ff0000", "rosybrown": "#bc8f8f", "royalblue": "#4169e1",
    "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4",
    "tan": "#d2b48c", "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
    "violet": "#ee82ee",
    "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
    "yellow": "#ffff00", "yellowgreen": "#9acd32"
};

var g_namedParams = { //review move all here
    dontQuery: "dontQuery",//1 when set
    fromMarkAllViewed: "fromMAV",//1 when set
    sortListNamed: "sortList",
    namedReport: "named" //popup inline reports use this
};

var NR_POPUP_REMAIN = "_remain"; //used in html
var g_cSyncSleep = 0;  //for controlling sync abuse
var g_bIgnoreEnter = false; //review zig
var FILTER_DATE_ADVANCED = "advanced";
var g_bNeedSetLastRowViewed = false;
var g_bAddParamSetLastRowViewedToQuery = false;
var g_rowidLastSyncRemember = -1;
var g_bBuildSqlMode = false;
var g_sortListNamed = null; //when not null, this array specifies the sort list by column name

var PIVOT_BY = {
    year: "year",
    month: "month",
    week: "", //review: weird way to make default
    day: "day"
};

//cache formats to avoid overloading sync. "format" is saved to sync so short names there to reduce sync usage
var g_dataFormatUser = { key: KEY_FORMAT_PIVOT_USER, interval: null, cLastWrite: 0, cCur: 0, format: { u: { c: g_colorDefaultUnder, v: null }, o: { c: g_colorDefaultOver, v: null } } };
var g_dataFormatBoard = { key: KEY_FORMAT_PIVOT_BOARD, interval: null, cLastWrite: 0, cCur: 0, format: { u: { c: g_colorDefaultUnder, v: null }, o: { c: g_colorDefaultOver, v: null } } };
var g_rgTabs = []; //tab data

function getCleanHeaderName(name) {
    if (!name)
        return "";
    var ret = name.split('\xa0')[0]; //hack: added &nbsp (g_hackPaddingTableSorter) to headers for tablesorter so remove them
    var iLast = ret.indexOf(g_postFixHeaderLast);
    if (iLast > 0)
        ret = ret.substr(0, iLast);
    //remove parenthesis (R case)
    iLast = ret.indexOf("(");
    if (iLast > 0)
        ret = ret.substr(0, iLast);
    return ret.trim();
}

function buildUrlFromParams(params, bNoPopupMode) {
    var doc = "report.html";
    var url = chrome.extension.getURL(doc);

    if (bNoPopupMode) {
        params["popup"] = 0;
        params[g_namedParams.namedReport] = "";
    }
    else {
        if (params["popup"] === undefined && g_bPopupMode)
            params["popup"] = "1";
    }
    assert(!g_bBuildSqlMode);

    var c = 0;
    for (var i in params) {
        var val = params[i];
        if (val == "")
            continue;
        if (c == 0)
            url += "?";
        else
            url += "&";
        url += (i + "=" + encodeURIComponent(val));
        c++;
    }
    return url;
}

function updateNamedReport(url) {
    if (g_namedReport)
        localStorage[g_namedParams.namedReport + ":" + g_namedReport] = url;
}

function updateUrlState(params) {
    if (g_namedReport)
        params[g_namedParams.namedReport] = g_namedReport;
    var url = buildUrlFromParams(params);
    window.history.replaceState('data', '', url);
    updateNamedReport(url);
}

function loadStorageGlobals(callback) {
    chrome.storage.sync.get([KEY_bIgnoreZeroECards, KEY_FORMAT_PIVOT_USER, KEY_FORMAT_PIVOT_BOARD, KEY_bEnableTrelloSync, keybEnterSEByCardComments, keyrgKeywordsforSECardComment], function (objs) {
        if (objs[KEY_FORMAT_PIVOT_USER] !== undefined)
            g_dataFormatUser.format = objs[KEY_FORMAT_PIVOT_USER];
        if (objs[KEY_FORMAT_PIVOT_BOARD] !== undefined)
            g_dataFormatBoard.format = objs[KEY_FORMAT_PIVOT_BOARD];
        g_bEnableTrelloSync = objs[KEY_bEnableTrelloSync] || false;
        g_optEnterSEByComment.loadFromStrings(objs[keybEnterSEByCardComments], objs[keyrgKeywordsforSECardComment]);
        g_bAllowNegativeRemaining = objs[KEY_bIgnoreZeroECards] || false;
        chrome.storage.local.get([LOCALPROP_PRO_VERSION], function (obj) {
            if (chrome.runtime.lastError) {
                alert(chrome.runtime.lastError.message);
                return;
            }
            g_bProVersion = obj[LOCALPROP_PRO_VERSION] || false;
            callback();
        });
    });
}

function loadTabs(parent) {
    if (g_bBuildSqlMode)
        return;
    var tabs = parent.children(".agile_tabselector_list").find("a");
    var i = 0;
    for (; i < tabs.length; i++) {
        var elem = tabs.eq(i);
        g_rgTabs.push(elem.attr("href"));
        elem.off().click(function () {
            selectTab(-1, $(this).attr("href"));
            return false;
        });
    }
}

window.addEventListener('resize', function () {
    if (g_iTabCur != null)
        selectTab(g_iTabCur, undefined, true);

    if (g_iTabCur == ITAB_CHART) {
        if (g_chartContainer)
            g_chartContainer.redraw();
    }

    if (g_bBuildSqlMode) {
        setTimeout(function () {
            window.parent.resizeMe(document.body.clientHeight + 60);
        }, 0);
    }
});

function selectTab(iTab, href, bForce) {
    if (iTab == null) {
        assert(g_iTabCur == null); //happens first time we init g_iTabCur
        iTab = 0;
    }

    if (g_bBuildSqlMode) {
        g_iTabCur = iTab;
        return;
    }

    function postSelect() {
        if (g_iTabCur == ITAB_CHART)
            setTimeout(fillChart, 100); //wait for final layout
    }

    if (iTab == g_iTabCur && !bForce) {
        postSelect();
        return; //ignore
    }



    var params = getUrlParams();
    iTab = selectTabUI(iTab, href);
    g_iTabCur = iTab;
    postSelect();
    if (params["tab"] != iTab) {
        if (params["tab"] || iTab != 0) { //not just an optimization. Print (ctrl+print) causes a resize. updating the url causes the print dialog to go away in windows chrome.
            params["tab"] = iTab;
            updateUrlState(params);
        }
    }
}

/* selectTabUI
 * 
 * select by iTab or href
 * to select by href pass -1 to iTab
 * RETURNS: iTab selected (useful for href case)
 **/
function selectTabUI(iTab, href) {
    if (g_bBuildSqlMode)
        return iTab;
    var i = 0;
    var selector = null;
    var classSelected = "agile_report_tabselector_selected";
    var selectedOld = $("." + classSelected);
    selectedOld.removeClass(classSelected);
    //selectedOld.parent().css("border-color", "#E8EBEE");
    var elemsHide = null;
    selectedOld.parent().removeClass("agile_tabcell_selected");
    for (; i < g_rgTabs.length; i++) {
        var cur = g_rgTabs[i];
        if (i == iTab || (href && href == cur)) {
            iTab = i;//for the href case
            selector = cur;
        }
        else {
            if (elemsHide)
                elemsHide = elemsHide.add($(cur));
            else
                elemsHide = $(cur);
        }
    }
    if (selector) {
        var elem = $(selector);
        var selectedNew = $(".agile_tabselector_list").find("a[href='" + selector + "']");
        selectedNew.addClass(classSelected);
        selectedNew.parent().addClass("agile_tabcell_selected");
        function fixScroller() {
            if (elemsHide)
                elemsHide.hide();
            var heightWindow = window.innerHeight;
            elem.show();
            if (g_bPopupMode && heightWindow > 470)
                heightWindow = 470; //prevent weird animations in popup when we exceed the original height in calculations
            var scroller = elem.find(iTab == ITAB_REPORT ? ".agile_tooltip_scroller" : ".agile_report_containerScroll");
            setScrollerHeight(heightWindow, scroller, scroller);
        }

        setTimeout(function () {
            fixScroller(); //this allows the tabs to refresh in case the tab is large (report tab)
        }, 10);

    }
    return iTab;
}

function findMatchingKeywords(term, autoResponse) {
    if (term == "*")
        term = "";
    var rg = [];

    if (g_optEnterSEByComment.IsEnabled())
        rg = g_optEnterSEByComment.rgKeywords;

    autoResponse(term == "" ? rg : rg.filter(function (item) {
        return (item.indexOf(term) >= 0);
    }));
}

function findMatchingTeams(term, autoResponse) {
    if (term == "*")
        term = "";
    var sql = "SELECT name FROM teams";
    var sqlPost = " ORDER BY LOWER(name) ASC";
    var paramsSql = [];

    if (term != "") {
        sql = sql + " where name LIKE ?";
        paramsSql.push("%" + term + "%");
    }
    getSQLReport(sql + sqlPost, paramsSql, function (response) {
        var rows = response.rows;
        if (response.status != STATUS_OK || !rows) {
            autoResponse([]);
            return;
        }

        var ret = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            ret[i] = rows[i].name;
        }

        autoResponse(ret);
    });
}

function findMatchingBoards(term, autoResponse) {
    if (term == "*")
        term = "";
    var nameTeam = $("#team").val().trim();
    var cWhere = 0;
    var sql = "SELECT B.name FROM boards B";
    var sqlPost = " ORDER BY LOWER(B.name) ASC";
    var paramsSql = [];

    if (nameTeam != "") {
        sql = sql + " LEFT OUTER JOIN TEAMS T ON B.idTeam=T.idTeam where T.name LIKE ?";
        paramsSql.push("%" + nameTeam + "%");
        cWhere++;
    }

    if (term != "") {
        if (cWhere == 0) {
            sql = sql + " WHERE";
        }
        else {
            sql = sql + " AND";
        }
        cWhere++;
        sql = sql + " B.name LIKE ?";
        paramsSql.push("%" + term + "%");
    }


    getSQLReport(sql + sqlPost, paramsSql, function (response) {
        var rows = response.rows;
        if (response.status != STATUS_OK || !rows) {
            autoResponse([]);
            return;
        }

        var ret = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            ret[i] = rows[i].name;
        }

        autoResponse(ret);
    });
}

function findMatchingLabels(term, autoResponse) {
    if (term == "*")
        term = "";
    var nameBoard = $("#board").val().trim();
    var idBoard = $("#idBoard").val().trim();
    var sql = null;
    var sqlPost = " ORDER BY LOWER(labels.name) ASC";
    var params = [];
    var cWhere = 0;

    if (idBoard.length > 0) {
        sql = "SELECT labels.name FROM labels where idBoardShort = ?";
        cWhere++;
        params.push(idBoard);
    }
    else if (nameBoard.length > 0) {
        sql = "SELECT distinct(labels.name) FROM labels join boards on labels.idBoardShort=boards.idBoard where boards.name LIKE ?";
        cWhere++;
        params.push("%" + nameBoard + "%");
    }
    else {
        sql = "SELECT distinct(labels.name) FROM labels";
    }

    if (term != "") {
        if (cWhere == 0) {
            sql = sql + " WHERE";
        }
        else {
            sql = sql + " AND";
        }
        cWhere++;
        sql = sql + " labels.name LIKE ?";
        if (g_bDummyLabel)
            sql = sql + " AND labels.idLabel<>'" + IDLABEL_DUMMY + "'";
        params.push("%" + term + "%");
    }

    getSQLReport(sql + sqlPost, params, function (response) {
        var rows = response.rows;
        if (response.status != STATUS_OK || !rows) {
            autoResponse([]);
            return;
        }

        var ret = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            ret[i] = rows[i].name;
        }

        autoResponse(ret);
    });
}

function findMatchingLists(term, autoResponse) {
    if (term == "*")
        term = "";
    var nameBoard = $("#board").val().trim();
    var idBoard = $("#idBoard").val().trim();
    var sql = null;
    var sqlPost = " ORDER BY LOWER(lists.name) ASC";
    var params = [];
    var cWhere = 0;

    if (idBoard.length > 0) {
        sql = "SELECT lists.name FROM lists where idBoard = ?";
        cWhere++;
        params.push(idBoard);
    }
    else if (nameBoard.length > 0) {
        sql = "SELECT distinct(lists.name) FROM lists join boards on lists.idBoard=boards.idBoard where boards.name LIKE ?";
        cWhere++;
        params.push("%" + nameBoard + "%");
    }
    else {
        sql = "SELECT distinct(lists.name) FROM lists";
    }

    if (term != "") {
        if (cWhere == 0) {
            sql = sql + " WHERE";
        }
        else {
            sql = sql + " AND";
        }
        cWhere++;
        sql = sql + " lists.name LIKE ?";
        params.push("%" + term + "%");
    }

    getSQLReport(sql + sqlPost, params, function (response) {
        var rows = response.rows;
        if (response.status != STATUS_OK || !rows) {
            autoResponse([]);
            return;
        }

        var ret = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            ret[i] = rows[i].name;
        }

        autoResponse(ret);
    });
}

function findMatchingUsers(term, autoResponse) {
    if (term == "*")
        term = "";
    var sql = "SELECT distinct(user) FROM history";
    var sqlPost = " ORDER BY LOWER(user) ASC";
    var params = [];
    if (term != "") {
        sql = sql + " where user LIKE ?";
        params.push("%" + term + "%");
    }
    sql = sql + sqlPost;
    getSQLReport(sql, params, function (response) {
        var rows = response.rows;
        if (response.status != STATUS_OK || !rows) {
            autoResponse([]);
            return;
        }

        var ret = new Array(rows.length);

        for (var i = 0; i < rows.length; i++) {
            ret[i] = rows[i].user;
        }

        autoResponse(ret);
    });
}


function findMatchingWeeks(term, autoResponse) {
    if (term == "*")
        term = "";
    var date = new Date();
    var rg = [];
    var daysDelta = 7;
    for (var i = 0; i < 53; i++) {
        rg.push(getCurrentWeekNum(date));
        date.setDate(date.getDate() - daysDelta);
    }
    autoResponse(term == "" ? rg : rg.filter(function (item) {
        return (item.indexOf(term) >= 0);
    }));
}

function findMatchingMonths(term, autoResponse) {
    if (term == "*")
        term = "";
    var date = new Date();
    var rg = [];
    var daysDelta = 7;
    date.setDate(1);
    for (var i = 0; i < 24; i++) {
        rg.push(getCurrentMonthFormatted(date));
        date.setMonth(date.getMonth() - 1);
    }

    autoResponse(term == "" ? rg : rg.filter(function (item) {
        return (item.indexOf(term) >= 0);
    }));
}

var g_portBackground = null;

function setupNotifications() {
    if (g_portBackground != null)
        return;
    g_portBackground = chrome.runtime.connect({ name: "registerForChanges" });
    g_portBackground.onMessage.addListener(function (msg) {
        if (msg.status != STATUS_OK)
            return;

        if (msg.event == EVENTS.DB_CHANGED) {
            hiliteOnce($("#agile_reload_page").show(), 10000);
        }
    });
}

function updateURLPart(part) {
    var params = getUrlParams();
    var elem = $("#" + part);
    var val = elem.val();
    if (typeof (elem[0].checked) != "undefined")
        val = (elem[0].checked ? "true" : "");
    if (params[part] != val) {
        params[part] = val;
        updateUrlState(params);
    }
}


var g_mapNameFieldToInternal = {
    team: "idTeamH",
    board: "idBoardH",
    list: "nameList",
    card: "idCardH",
    hashtag: "hashtagFirst",
    user: "user",
    keyword: "keyword",
    date: "dateString"
};

document.addEventListener('DOMContentLoaded', function () {
    //chrome Content Security Policy (CSP) needs DOMContentLoaded
    if (g_bLoaded)
        return;
    g_bLoaded = true;

    addTableSorterParsers();
    //any params that do not have a UI counterpart will be stripped later, so get them here and set a few global states
    var params = getUrlParams();
    var bDisableSortInPopup = false;
    var namedReport = params[g_namedParams.namedReport];
    var bNeedReplaceState = false;
    g_bPopupMode = (params["popup"] == "1"); //this one wins over saved one
    g_bBuildSqlMode = (params["getsql"] == "1");

    if (namedReport) {
        g_namedReport = namedReport;
        if (params["useStoredNamed"]) {
            var urlNew = localStorage[g_namedParams.namedReport + ":" + namedReport];
            if (urlNew) {
                params = getUrlParams(urlNew);
                //for safety prevent bad params from getting stuck
                params["popup"] = (g_bPopupMode ? "1" : "0");
                params["getsql"] = (g_bBuildSqlMode ? "1" : "0");
                bNeedReplaceState = true;
            }
        }

        if (g_namedReport == NR_POPUP_REMAIN) {
            bDisableSortInPopup = true;
            params["orderBy"] = "remain"; //force. we disable it so user could get stuck if someone the combo changes (in theory shouldnt change thou)
            bNeedReplaceState = true;
        }
    }

    if (bNeedReplaceState) {
        if (g_namedReport)
            params[g_namedParams.namedReport] = g_namedReport;
        window.history.replaceState('data', '', buildUrlFromParams(params));
    }

    if (!g_bPopupMode)
        $("body").removeClass("agile_report_minSize");

    if (g_bBuildSqlMode) {
        $("#tabs").hide();
        $("#agile_title_header_report").hide();
        $("#groupBy").parent().hide();
        $("#pivotBy").parent().hide();
        $("#orderBy").parent().hide();
        $("#team").parent().hide();
        $("#board").parent().hide();
        $("body").css("margin-top", "0px");
        $("#report_top_section").css("margin-bottom", "0px");

    }

    loadTabs($("#tabs"));

    if (g_bPopupMode) {
        $("#team").parent().hide();
        $("#archived").parent().hide();
        $("#deleted").parent().hide();
        $("#eType").parent().hide();
        
        if (bDisableSortInPopup)
            $("#orderBy").prop('disabled', true);
        else if (g_bPopupMode) {
            $("#orderBy option[value*='remain']").remove();
        }

        $("#card").parent().hide();
        $("#list").parent().hide();
        $("#comment").parent().hide();

        if (params["orderBy"] == "remain") {
            $("#sinceSimple").parent().hide();
            $("#pivotBy").parent().hide();
            $(".agile_tab_rest").hide();
            $(".agile_tab_chart").show();
        }
    }
    else {
        $("#archived").parent().show();
        $("#deleted").parent().show();
    }

    if (g_bPopupMode) {
        $("#agile_title_header_report").hide();
        //$("body").height(470); //these two are also duplicated in report.html body so that reports opened from the popup (spent this week) has the right size (prevent flicker)
        //$("body").width(685);
        var dockOut = $("#dockoutImg");
        dockOut.attr("src", chrome.extension.getURL("images/dockout.png"));
        dockOut.show();
        dockOut.css("cursor", "pointer");
        dockOut.off().click(function () { //cant use setPopupClickHandler because url could have changed if user navigated inside 
            var urlDockout = buildUrlFromParams(getUrlParams(), true);
            chrome.tabs.create({ url: urlDockout });
            return false;
        });


        var back = $("#backImg");
        back.attr("src", chrome.extension.getURL("images/back.png"));
        back.show();
        back.css("cursor", "pointer");
        back.off().click(function () {
            window.history.back();
            return false;
        });

    }

    openPlusDb(function (response) {
        if (response.status != STATUS_OK) {
            return;
        }
        if (!g_bBuildSqlMode)
            setupNotifications();

        $("#agile_reload_page_link").off().click(function (e) {
            e.preventDefault();
            var params = getUrlParams();
            if (g_bAddParamSetLastRowViewedToQuery)
                params["setLastRowViewed"] = "true";
            configReport(params, true);

        });

        $("#chartView").change(function () {
            var typeChart = $("#chartView").val();
            fillChart();
            var params = getUrlParams();
            if (params["chartView"] != typeChart) {
                params["chartView"] = typeChart;
                updateUrlState(params);
            }
        });

        $("#stackCount").change(function () {
            updateURLPart("stackCount");
            chartCountCards();
            
        });

        $("#checkNoColorsChartCount").change(function () {
            updateURLPart("checkNoColorsChartCount");
            if (g_dataChart)
                g_dataChart.params["checkNoColorsChartCount"] = ($("#checkNoColorsChartCount")[0].checked==true?"true":"");
            chartCountCards();

        });

        function addFocusHandler(elem) {
            var specialAll = "*"; //wasted time getting .autocomplete to work on "" so this hack worksarround it
            elem.off("focus.plusForTrello").on("focus.plusForTrello", function () {
                if (this.value == "" || this.value == specialAll)
                    $(this).autocomplete("search", specialAll);
            });
        }

        addFocusHandler($("#keyword").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingKeywords(request.term, response);
            }

        }));
        addFocusHandler($("#team").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingTeams(request.term, response);
            }
        }));

        addFocusHandler($("#board").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingBoards(request.term, response);
            }
        }));

        addFocusHandler($("#user").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingUsers(request.term, response);
            }
        }));

        addFocusHandler($("#list").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingLists(request.term, response);
            }
        }));


        addFocusHandler($("#weekStart").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingWeeks(request.term, response);
            }
        }));

        addFocusHandler($("#weekEnd").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingWeeks(request.term, response);
            }
        }));

        addFocusHandler($("#monthStart").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingMonths(request.term, response);
            }
        }));

        addFocusHandler($("#monthEnd").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingMonths(request.term, response);
            }
        }));

        addFocusHandler($("#label").autocomplete({
            delay: 0,
            minChars: 0,
            source: function (request, response) {
                findMatchingLabels(request.term, response);
            }
        }));

        loadStorageGlobals(function () {
            configAllPivotFormats();
            configChartTab();
            loadReport(params);
        });
    });
});

function configChartTab() {
    var copyWindow = $("#tabs-3").find(".agile_drilldown_select");

    if (copyWindow.length > 0) {
        copyWindow.attr("src", chrome.extension.getURL("images/copy.png"));
        copyWindow.attr("title", "Click to download as a PNG image.");
        copyWindow.off().click(function () {
            if (bCancelFromAlertLargeSize(true))
                return;
            var elemChart = $("#chart");
            var nameChart = window.prompt("Name for the PNG file:", "chart");
            if (nameChart)
                saveSvgAsPng(elemChart[0], nameChart.trim()+".png", { scale: window.devicePixelRatio || 1 });
        });
    }
}

var g_cacheCells = {}; //cache cells to speed up formatting when user changes the ranges

function configPivotFormat(elemFormat, dataFormat, tableContainer, iTab) {
    var underElem = elemFormat.children(".agile_format_under");
    var overElem = elemFormat.children(".agile_format_over");
    var colorUnderElem = elemFormat.children(".agile_colorpicker_colorUnder");
    var colorOverElem = elemFormat.children(".agile_colorpicker_colorOver");
    var colorNormal = "#FFFFFF"; //review zig: get it from css
    var comboFormat = elemFormat.children(".agile_report_optionsFormat");
    var copyWindow = elemFormat.find(".agile_drilldown_select");

    if (copyWindow.length > 0) {
        copyWindow.attr("src", chrome.extension.getURL("images/copy.png"));
        copyWindow.attr("title", "Click to copy table to your clipboard, then paste elsewhere (email, spreadsheet, etc.)");
        copyWindow.off().click(function () {
            var table = tableContainer;
            selectElementContents(table[0]);
        });
    }

    underElem.val(dataFormat.format.u.v);
    colorUnderElem.val(dataFormat.format.u.c);
    overElem.val(dataFormat.format.o.v);
    colorOverElem.val(dataFormat.format.o.c);
    comboFormat.val(dataFormat.format.f || "smooth");

    function applyFormat(bFirstTime) {
        if (bFirstTime)
            applyFormatWorker(bFirstTime); //review zig: should be ok in setTimeout but here to reduce risk of making this change.
        else
            setTimeout(function () { applyFormatWorker(bFirstTime); }, 10);
    }

    function applyFormatWorker(bFirstTime) {
        var weekCur = getCurrentWeekNum(new Date());
        var strUnder = underElem.val();
        var strOver = overElem.val();
        var valUnder = (strUnder.length == 0 ? null : parseFloat(strUnder));
        var valOver = (strOver.length == 0 ? null : parseFloat(strOver));
        var colorUnder = colorUnderElem.val();
        var colorOver = colorOverElem.val();
        var formatType = comboFormat.val();
        var bNoFormat = formatType == "off";
        var bStrictFormat = formatType == "strict";
        var rgbUnder = rgbFromHex(colorUnder);
        var rgbOver = rgbFromHex(colorOver);

        if (bNoFormat) {
            savePivotFormat(dataFormat, colorUnder, colorOver, valUnder, valOver, formatType);
            valUnder = null;
            valOver = null;
            underElem.prop('disabled', true);
            overElem.prop('disabled', true);

        }
        else {
            savePivotFormat(dataFormat, colorUnder, colorOver, valUnder, valOver, formatType);
            underElem.removeAttr('disabled');
            overElem.removeAttr('disabled');
        }

        if (bFirstTime && (bNoFormat || (valUnder === null && valOver === null)))
            return; //performance

        if (g_iTabCur != null && g_iTabCur != iTab)
            setTimeout(function () { workerCells(); }, 200);
        else
            workerCells();

        function workerCells() {
            var cells = g_cacheCells[dataFormat.key];
            if (cells === undefined) {
                cells = tableContainer.find(".agile_pivot_value");
                if (!bFirstTime)
                    g_cacheCells[dataFormat.key] = cells; //cache when called from format change so its fast as the user changes values
            }

            cells.each(function () {
                var bUsedUnder = false;
                var rgb = null;
                var el = $(this);
                var val = parseFloat(el.text());
                var color = colorNormal;

                if (el.data("agile_total_row") == "true") {
                    //until the week is done doesnt make sense to color under
                    color = "#FFFFFF";
                    rgb = null; //so it resets below
                }
                else if (valUnder == null && valOver == null)
                    color = colorNormal;
                else if (valUnder != null && val < valUnder) {
                    color = colorUnder;
                    bUsedUnder = true;
                }
                else if (valOver != null && val > valOver)
                    color = colorOver;
                else if (!bStrictFormat && (valUnder != null || valOver != null)) {
                    //in between
                    var distance = 0;
                    if (valUnder != null && valOver != null)
                        distance = valOver - valUnder;
                    else if (valUnder != null)
                        distance = valUnder;
                    else
                        distance = valOver;
                    distance = distance / 4;

                    var rgbLeft = null;
                    var rbgRight = null;
                    var rgbWhite = rgbFromHex("#FFFFFF");
                    var percentSpread = 0.7; //% of the color range to use.
                    //used to leave 1/2 of the difference on each side so its easier to distinguish the actual boundary
                    var diff = 0;
                    if (valUnder != null && (val - valUnder <= distance)) {
                        rgbLeft = rgbUnder;
                        rgbRight = rgbWhite;
                        diff = val - valUnder;
                        bUsedUnder = true;
                    } else if (valOver != null && (valOver - val <= distance)) {
                        rgbLeft = rgbOver;
                        rgbRight = rgbWhite;
                        diff = valOver - val;
                    }

                    if (rgbLeft == null) {
                        rgb = rgbWhite;
                    } else {
                        rgb = [];
                        var iColor = 0;
                        var rate = (1 - percentSpread) / 2 + (diff / distance) * percentSpread;
                        for (; iColor < 3; iColor++)
                            rgb.push(Math.round(rgbLeft[iColor] + (rgbRight[iColor] - rgbLeft[iColor]) * rate));
                    }
                    color = "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";
                }

                if (bUsedUnder && el.data("agile_week") == weekCur) {
                    //until the week is done doesnt make sense to color under
                    color = "#FFFFFF";
                    rgb = null; //so it resets below
                }

                el.css("background", color);
                var colorText = g_colorTrelloBlack;

                if (el.hasClass("agile_pivotCell_Zero"))
                    colorText = color; //prevent filling report with zeros which clutter it. value is there but with color equal to background
                else
                    colorText = colorContrastWith(color, rgb, g_colorTrelloBlack);

                el.css("color", colorText);
            });
        }
    }

    applyFormat(true);
    comboFormat.off().change(function () {
        applyFormat(false);
    });

    function onEditsChange() {
        applyFormat(false);
    }

    underElem.off().on('input', onEditsChange);
    overElem.off().on('input', onEditsChange);
    colorUnderElem.off().on('input', onEditsChange);
    colorOverElem.off().on('input', onEditsChange);
}

function colorContrastWith(color, rgb, colorTrelloBlack) {
    var colorText = colorTrelloBlack;

    if (!rgb)
        rgb = rgbFromHex(color);
    if (rgb) {
        var sum = rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722; //standard luminance. This will never be perfect a user's gamma/calibration is never the same.
        if (sum < 128)
            colorText = "white";
    }
    return colorText;
}


function rgbFromHex(hex) {
    var regexRGB = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/;
    var rgb = regexRGB.exec(hex);
    if (!rgb) {
        var hexNamedColor = g_colours[hex.toLowerCase()];
        if (hexNamedColor) {
            rgb = regexRGB.exec(hexNamedColor);
        }
        if (!rgb)
            return null;
    }
    return [parseInt(rgb[1], 16), parseInt(rgb[2], 16), parseInt(rgb[3], 16)];
}

function savePivotFormat(dataFormat, colorUnder, colorOver, valUnder, valOver, formatType) {
    var before = JSON.stringify(dataFormat.format);
    var obj = dataFormat.format.u;
    obj.c = colorUnder;
    obj.v = valUnder;
    obj = dataFormat.format.o;
    obj.c = colorOver;
    obj.v = valOver;
    dataFormat.format.f = formatType;
    var after = JSON.stringify(dataFormat.format);
    var waitNormal = 4000;

    function saveToSync(bNow) {
        //look until it stabilizes, otherwise dont sync it this time.
        var lastFormat = JSON.stringify(dataFormat.format);
        var wait = waitNormal * 3 / 4;
        if (bNow && bNow == true)
            wait = 200;

        setTimeout(function () {
            if (!bNow && g_cSyncSleep > 0) {
                g_cSyncSleep--;
                return;
            }
            var currentFormat = JSON.stringify(dataFormat.format);
            if (currentFormat != lastFormat)
                return;
            var pair = {};
            var cCur = dataFormat.cCur; //separate from global format
            pair[dataFormat.key] = dataFormat.format;
            chrome.storage.sync.set(pair, function () {
                if (chrome.runtime.lastError === undefined)
                    dataFormat.cLastWrite = Math.max(dataFormat.cLastWrite, cCur);
                else
                    g_cSyncSleep = 5; //will sleep next x cicles
            });
        }, wait);
    }

    if (before != after) {
        dataFormat.cCur++;
        if (dataFormat.interval == null) {
            saveToSync(true); //first change saves right away
            dataFormat.interval = setInterval(function () {
                if (dataFormat.cCur != dataFormat.cLastWrite)
                    saveToSync(false);
            }, waitNormal); //keep sync quotas happy
        }
    }
}

function invertColor(hexTripletColor) {
    var color = hexTripletColor;
    color = color.substring(1);           // remove #
    color = parseInt(color, 16);          // convert to integer
    color = 0xFFFFFF ^ color;             // invert three bytes
    color = color.toString(16);           // convert to hex
    color = ("000000" + color).slice(-6); // pad with leading zeros
    color = "#" + color;                  // prepend #
    return color;
}

function getParamAndPutInFilter(elem, params, name, valDefault) {
    var value = params[name];
    var str = "";
    var bShowHide = (valDefault == "showhide");
    if (!bShowHide)
        str = valDefault;
    if (value && value != "")
        str = decodeURIComponent(value);
    if (name.indexOf("check") == 0)
        elem[0].checked = (str == "true");
    else {
        elem.val(str);
        if (elem.val() != str) {
            //allow user to type a random filter from the url
            if (elem.is("select")) {
                elem.append($(new Option(str, str)));
                elem.val(str);
            }
        }
    }
    if (bShowHide) {
        var parent = elem.parent();
        if (str.length > 0)
            parent.show();
        else {
            parent.hide();
        }
    }

    return str;
}

function loadReport(params) {
    selectTab(params["tab"] || null);
    $("#divMain").show();
    var bDontQuery = (params[g_namedParams.dontQuery] == "1");
    var bFromMarkAllViewed = (params[g_namedParams.markAllViewed] == "1");
    var szSortListParam = params[g_namedParams.sortListNamed];
    if (szSortListParam) {
        g_sortListNamed = JSON.parse(szSortListParam);
    }
    else {
        g_sortListNamed = null;
    }
    var sinceSimple = "";
    if (params.weekStartRecent == "true") {
        sinceSimple = "w-4";
    }

    if (params.setLastRowViewed == "true")
        g_bNeedSetLastRowViewed = true;
    else
        g_bNeedSetLastRowViewed = false;

    var comboSinceSimple = $("#sinceSimple");
    var comboOrderBy = $('#orderBy');
    var groupDateAdvanced = $("#groupDateAdvanced");

    //note: "all" in comboSinceSimple has value "" thus gets selected by default when there is no param
    function updateDateState() {
        if (comboSinceSimple.val() == FILTER_DATE_ADVANCED) {
            groupDateAdvanced.show();
            selectTab(g_iTabCur); //body size can change when showing fields
        } else {
            groupDateAdvanced.hide();
            selectTab(g_iTabCur); //body size can change when hiding fields
        }
    }

    comboSinceSimple.off().change(function () {
        updateDateState();
    });

    comboOrderBy.off().change(function () {
        if (comboOrderBy.val() == "remain") {
            comboSinceSimple.val("");
            hiliteOnce(comboSinceSimple);
            updateDateState();

        }
    });


    g_bShowLabelsFilter = g_bProVersion;
    if (g_bProVersion)
        $("#labelOptionsProOnly").hide();

    var editLabels = $("#label");
    var editKeyword = $("#keyword");
    g_bShowKeywordFilter = (g_optEnterSEByComment.IsEnabled() && g_optEnterSEByComment.getAllKeywordsExceptLegacy().length > 1);

    var elems = {
        stackCount: "", checkNoColorsChartCount: "false", chartView: g_chartViews.ser, keyword: "showhide", groupBy: "", pivotBy: "", orderBy: "date", showZeroR: "", sinceSimple: sinceSimple, weekStart: "", weekEnd: "",
        monthStart: "", monthEnd: "", user: "", team: "", board: "", list: "", card: "", label: "", comment: "", eType: "all", archived: "0", deleted: "0",
        idBoard: (g_bBuildSqlMode ? "" : "showhide"), idCard: "showhide", checkNoCrop: "false", afterRow: "showhide", checkNoCharts: "false",
        checkNoLabelColors: "false", checkOutputCardShortLink: "false", checkOutputBoardShortLink: "false", checkOutputCardIdShort: "false"
    };

    if (g_bPopupMode && params["checkNoCrop"] == "true")
        params["checkNoCrop"] = "false"; //hacky. because popup mode no longer supports options, undo any remembered cropping option

    if (params["groupBy"] == "custom")
        params["groupBy"] = ""; //too late here

    for (var iobj in elems) {
        var elemCur = $("#" + iobj);
        elemCur.off("keypress.plusForTrello").on("keypress.plusForTrello", function (event) {
            if (g_bIgnoreEnter)
                return;
            var keycode = (event.keyCode ? event.keyCode : event.which);
            if (keycode == '13') { //enter key
                onQuery();
            }
        });

        getParamAndPutInFilter(elemCur, params, iobj, elems[iobj]);
        if ((iobj == "idBoard" || iobj == "idCard") && elems[iobj].length > 0)
            hiliteOnce(elemCur);
    }

    var elemChartMessage = $("#chartMessage");
    elemChartMessage.text(""); //reset

    if (params["checkNoCharts"] == "true") {
        elemChartMessage.text("To view charts, uncheck 'No Charts' from reports Options and query again.");
    } else if (!params["groupBy"]) {
        elemChartMessage.text("To view a chart, make a report that is grouped by other than 'S/E rows'.");
    }


    if (g_bShowLabelsFilter) {
        editLabels.parent().show();
    }
    else {
        editLabels.parent().hide();
        $("#groupBy option[value*='label']").remove();
    }

    if (g_bShowKeywordFilter)
        editKeyword.parent().show();
    else {
        editKeyword.parent().hide();
        $("#orderBy option[value*='keyword']").remove();
        $("#groupBy option[value*='keyword']").remove();
    }

    if (!g_bEnableTrelloSync) {
        $("#list").prop('disabled', true).prop("title", "Disabled until you enable Sync from Plus help.");
        $("#orderBy option[value*='nameList']").remove();
        $("#orderBy option[value*='posList']").remove();
        $("#groupBy option[value*='nameList']").remove();
    }

    if (!g_bPopupMode && !g_bEnableTrelloSync) {
        var strAppendNoSync = "Enable sync to use archived and deleted.";
        $("#archived").prop('disabled', true).addClass("agile_background_disabled").prop("title", strAppendNoSync);
        $("#deleted").prop('disabled', true).addClass("agile_background_disabled").prop("title", strAppendNoSync);
    }

    updateDateState();
    var btn = $("#buttonFilter");

    function onQuery(bFirstTime) {
        if (bFirstTime && g_bBuildSqlMode)
            bFirstTime = false;

        g_cacheCells = {}; //clear cache
        if (false) { //review zig: figure out how to make this work.
            var iForms = 0;
            var forms = $("form");
            function handleFormsSubmit(iform, forms) {
                setTimeout(function () {
                    document.forms[forms[iform].name].submit();
                    if (iform + 1 < forms.length)
                        handleFormsSubmit(iform + 1, forms);
                }, 100);
            }

            handleFormsSubmit(0, forms);
        }

        if (!g_bBuildSqlMode) {
            setBusy(true, btn);
            btn.attr('disabled', 'disabled');
        }
        if (bFirstTime)
            btn.text("•••");
        for (var iobj in elems) {
            if (iobj == "tab")
                continue;
            var elemCur = $("#" + iobj);
            if (iobj.indexOf("check") == 0)
                elems[iobj] = (elemCur[0].checked ? "true" : "false"); //keep it a string so its similar to the other properties
            else {
                elems[iobj] = elemCur.val();
                //clear advanced date filters if a simple one is being used. Do it on query and not on list change so user can experient with the ui without losing what was typed.
                if (iobj == "sinceSimple" && elems[iobj] != FILTER_DATE_ADVANCED)
                    groupDateAdvanced.find("input").val(""); //review: implement a "postGet" event defined per field so each field handles this
            }
        }
        assert(g_iTabCur != null);
        elems["tab"] = g_iTabCur;

        if (bFirstTime && !g_bPopupMode) {
            //these set of timeouts could be done all together but the GUI wont update instantly.
            //handles this case: 1) make a huge report, 2) view by User, 3) change the filter and click Query again.
            //without this, the pivot view would take a long time to clear because its waiting for the report to clear (which can take a few seconds with 10,000 rows).
            $(".agile_report_container_byUser").empty().html("&nbsp;&nbsp;&nbsp;•••");
            $(".agile_report_container_byBoard").empty().html("&nbsp;&nbsp;&nbsp;•••");
            $(".agile_topLevelTooltipContainer").empty().html("&nbsp;&nbsp;&nbsp;•••");
            configReport(elems);
        } else {
            configReport(elems, !bFirstTime && !g_bBuildSqlMode);
        }
    }

    var headerOptions = $("#headerOptions");
    var containerOptions = $("#optionsContainer");

    if (g_bBuildSqlMode || g_bPopupMode)
        containerOptions.hide();
    else
        containerOptions.show();
    headerOptions.off().click(function () {
        handleSectionSlide(containerOptions, $("#report_options_section"));
    });

    btn.off().click(function () {
        onQuery();
    });

    if (!g_bBuildSqlMode && Object.keys(params).length > 0 && !bDontQuery) { //dont execute query automatically
        if (g_bPopupMode)
            onQuery(true);
        else
            setTimeout(function () { onQuery(true); }, 10);
    }
    else {
        if (!g_bBuildSqlMode) {
            delete params[g_namedParams.dontQuery];
            delete params[g_namedParams.markAllViewed];
            updateUrlState(params);
        }
        resetQueryButton(btn);
        if (bFromMarkAllViewed)
            $("#reportBottomMessage").show().html("s/e rows marked viewed. Close this window or query a new report.");
    }
}


function showError(err) {
    alert("Plus for Trello:" + err);
}

function completeString(str, pattern) {
    var c = pattern.length;
    while (str.length < c)
        str = str + pattern.charAt(str.length);
    return str;
}

//advancedParams:
// bNoWhereAnd: IN. hacky. will also not increment cFilters
// bLabelMode: IN
// bNegateAll : OUT
// errorParse: OUT. if set (string), a parsing error occurred
function buildSqlParam(param, params, table, sqlField, operator, state, completerPattern, btoUpper, advancedParams) {
    advancedParams = advancedParams || {};
    if (table)
        table = table + ".";
    else
        table = "";
    if (btoUpper === undefined)
        btoUpper = true;
    var val = params[param];
    if (val == "")
        return "";

    var bString = (typeof (val) == 'string');
    if (completerPattern)
        val = completeString(val, completerPattern);
    var sql = "";
    var parts = null;
    if (bString) {
        val = val.trim();
        if (btoUpper)
            val = val.toUpperCase();
    }

    //review zig: need more generic way to interpret parameters without hardcoding all here
    if (param == "eType")
        val = g_mapETypeParam[val];

    if (param == "sinceSimple") {
        parts = val.split("-");
        if (parts.length < 2)
            return "";	 //ignore if value is not in tuple format. caller deals with those (advanced, all, etc)
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        var delta = (parseInt(parts[1], 10) || 0) - 1;
        if (parts[0] == "W")
            delta = (delta * 7) + DowMapper.posWeekFromDow(now.getDay());

        now.setDate(now.getDate() - delta);
        val = Math.round(now.getTime() / 1000); //db date are in seconds
    }

    //a bit ugly to reuse the old month field but it was easiest like this and falls back to month when needed
    //historically this only filtered on months. really using the month field is about the same as using the date filter perf-wise
    //but keeping the special-case month filter as it might be a bit faster on large reports
    if (param == "monthStart" || param == "monthEnd") {
        parts = val.split("-");
        if (parts.length == 3) {
            var yearParsed = parseInt(parts[0], 10);
            var monthParsed = parseInt(parts[1], 10);
            var dayParsed = parseInt(parts[2], 10);
            if (yearParsed > 1900 && monthParsed > 0 && dayParsed > 0) {
                var dateParsed = new Date(yearParsed, monthParsed - 1, dayParsed);
                if (param == "monthEnd")
                    dateParsed.setHours(23, 59, 59, 999);
                sqlField = "date";
                val = Math.round(dateParsed.getTime() / 1000); //db date are in seconds
            }
        }
    }

    if (param == "archived") {
        val = parseInt(val, 10) || 0;
        if (val < 0) //"All" is -1
            return "";
    }

    if (param == "deleted") {
        val = parseInt(val, 10) || 0;
        if (val < 0) //"All" is -1
            return "";
    }

    bString = (typeof (val) == 'string'); //refresh

    if (!advancedParams.bNoWhereAnd) {
        if (state.cFilters == 0)
            sql += " WHERE ";
        else
            sql += " AND ";
    }

    var decorate = "";
    var bAllowOrAnd = false;

    if (operator.toUpperCase() == "LIKE") {
        assert(bString);
        decorate = "%";
        bAllowOrAnd = true;
    }

    if (bAllowOrAnd && val.length > 1) {
        var chFirst = val.charAt(0);
        var chLast = val.slice(-1);
        if ((chFirst == "'" || chFirst == '"') && chFirst == chLast) {
            bAllowOrAnd = false;
            val = val.substring(1, val.length - 1);
        }
    }

    var opOrAnd = "";
    var opOrAndOrig = "";
    var valElems = [val];
    if (bAllowOrAnd) {
        if (val.indexOf(" AND ") > 0)
            opOrAnd = " AND ";
        else if (val.indexOf(" OR ") > 0)
            opOrAnd = " OR ";

        opOrAndOrig = opOrAnd;
        if (opOrAnd) {
            valElems = val.split(opOrAnd);
        }
    }

    var bMultiple = valElems.length > 1;
    var cProcessed = 0;
    var cNegated = 0;
    var cFiltersAdd = 0;
    var valuesAdd = [];
    if (bMultiple)
        sql += "(";
    valElems.forEach(function (val) {
        cProcessed++;
        var opNot = "";
        if (bString)
            val = val.trim();
        if (bAllowOrAnd && val.charAt(0) == "!") {
            opNot = "NOT ";
            cNegated++;
            val = val.substr(1);
            if (advancedParams.bLabelMode) {
                opNot = "";
                advancedParams.bNegateAll = true;
                if (opOrAnd)
                    opOrAnd = " OR "; //apply !A AND !B AND !C --> !(A OR B OR C)
            }
        }

        if (bString && btoUpper)
            sql += ("UPPER(" + table + sqlField + ") " + opNot + operator + " ?");
        else
            sql += (table + sqlField + " " + operator + " ?");

        if (bMultiple && cProcessed != valElems.length)
            sql = sql + opOrAnd;
        if (!advancedParams.bNoWhereAnd)
            cFiltersAdd++;
        valuesAdd.push(decorate == "" ? val : decorate + val + decorate);
    });

    if (advancedParams.bLabelMode) {
        if (opOrAnd == " AND ") {
            advancedParams.errorParse = "AND is not supported unless all terms are negated, as in: !a AND !b AND !c";
        }
        else if ((cNegated > 0 && opOrAndOrig == " OR ") || //no negation with OR
            (advancedParams.bNegateAll && cNegated != valElems.length)) { //when negating, negate all
            advancedParams.errorParse = "When using ! (negation) with multiple terms, all terms must be negated with AND, as in: !a AND !b AND !c";
        }
    }

    if (bMultiple)
        sql += ")";

    if (advancedParams.errorParse)
        sql = "";
    else {
        state.cFilters += cFiltersAdd;
        valuesAdd.forEach(function (val) {
            state.values.push(val);
        });
    }
    return sql;
}

function buildSql(elems) {

    var cErrors = 0;
    function buildAllParams(state, bTable) {
        //bTable is needed to dissambiguate when table column names collide in joins
        var sql = "";
        var pre = (bTable ? "H" : "");
        sql += buildSqlParam("sinceSimple", elems, pre, "date", ">=", state);
        sql += buildSqlParam("weekStart", elems, "", "week", ">=", state);
        sql += buildSqlParam("weekEnd", elems, "", "week", "<=", state, "9999-W99");
        sql += buildSqlParam("monthStart", elems, "", "month", ">=", state);
        sql += buildSqlParam("monthEnd", elems, "", "month", "<=", state, "9999-99");
        sql += buildSqlParam("user", elems, pre, "user", "LIKE", state);
        sql += buildSqlParam("team", elems, "", "nameTeam", "LIKE", state);
        sql += buildSqlParam("board", elems, "", "nameBoard", "LIKE", state); //note LIKE allows and/or
        sql += buildSqlParam("list", elems, "", "nameList", "LIKE", state);
        sql += buildSqlParam("card", elems, "", "nameCard", "LIKE", state);
        sql += buildSqlParam("comment", elems, "", "comment", "LIKE", state);
        sql += buildSqlParam("eType", elems, "", "eType", "=", state);
        sql += buildSqlParam("archived", elems, "", "bArchivedCB", "=", state);
        sql += buildSqlParam("deleted", elems, "", "bDeleted", "=", state);
        sql += buildSqlParam("idBoard", elems, "", "idBoardH", "=", state);
        sql += buildSqlParam("idCard", elems, "", "idCardH", "=", state);
        sql += buildSqlParam("afterRow", elems, pre, "rowid", ">", state, null, false);
        sql += buildSqlParam("keyword", elems, "", "keyword", "LIKE", state);

        if (elems["orderBy"] == "dateDue")
            sql += buildSqlParam("dateDue", { dateDue: null }, "", "dateDue", "IS NOT", state);

        if (g_bShowLabelsFilter) {
            if (elems["label"]) {
                var advancedParams = { bNoWhereAnd: true, bLabelMode: true, bNegateAll: false, errorParse: "" };
                var sqlLabels = "SELECT LC.idCardShort FROM LABELCARD as LC JOIN LABELS as L on LC.idLabel=L.idLabel WHERE " +
                    buildSqlParam("label", elems, "", "L.name", "LIKE", state, undefined, undefined, advancedParams);
                if (advancedParams.errorParse) {
                    if (cErrors == 0)
                        sendDesktopNotification("Error: unsupported label filter. Please hover the labels filter for help: " + advancedParams.errorParse, 12000);
                    cErrors++;
                }
                else {
                    sql += (state.cFilters > 0 ? " AND" : " WHERE") + " C.idCard" + (advancedParams.bNegateAll ? " NOT" : "") + " in (" + sqlLabels + ")";
                }
            }

        }
        return sql;
    }

    //note: the query itself doesnt group because we later do need the entire history to fill the pivot tabs.
    var groupByLower = (elems["groupBy"] || "").toLowerCase();
    var bByROpt = false;
    var bHasUnion = false;
    var sql = "select H.rowid as rowid, H.keyword as keyword, H.user as user, H.week as week, H.month as month, H.spent as spent, H.est as est, \
                CASE WHEN (H.eType="+ ETYPE_NEW + ") then H.est else 0 end as estFirst, \
                H.date as date, H.comment as comment, H.idCard as idCardH, H.idBoard as idBoardH, T.idTeam as idTeamH, T.name as nameTeam,T.nameShort as nameTeamShort, L.name as nameList, L.pos as posList, C.name as nameCard, C.idShort as idShort, B.name as nameBoard, H.eType as eType, \
                CASE WHEN (C.bArchived+B.bArchived+L.bArchived)>0 then 1 else 0 end as bArchivedCB, C.bDeleted as bDeleted, C.dateDue as dateDue \
                FROM HISTORY as H \
                JOIN CARDS as C on H.idCard=C.idCard \
                JOIN LISTS as L on C.idList=L.idList \
                JOIN BOARDS B on H.idBoard=B.idBoard \
                LEFT OUTER JOIN TEAMS T on B.idTeam=T.idTeam";

    var bOrderByR = (elems["orderBy"] == "remain"); //this special-case filters out zero R. special-case it to speed it up
    var bAllDates = (elems["sinceSimple"] == "");

    //cardbalance is indexed by diff. using that index makes report O(log n) versus O(n)
    //cant do it with filters because S/E/E1st totals would be off 
    if (bOrderByR && bAllDates && elems["eType"] == "" && elems["afterRow"] == "" && elems["comment"] == "") {
        sql += " JOIN CARDBALANCE CB on CB.idCard=C.idCard AND H.user=CB.user AND CB.diff<>0";
        bByROpt = true;
    }
    var state = { cFilters: 0, values: [] };
    sql += buildAllParams(state, true);


    //note: currently week/month isnt stored in cards table thus we cant filter by these.
    //can be fixed but its an uncommon use of filters where user also wants to include cards without s/e
    if (groupByLower != "" &&
        !elems["weekStart"] && !elems["weekEnd"] && !elems["user"]  && !bOrderByR) {
        assert(!g_bBuildSqlMode);
        bHasUnion = true;
        //REVIEW: since now we do a full pass to find duplicate card rows, consider doing two separate queries.
        //note: use -1 as rowid so when doing a "new s/e rows" report and a group is used, this union wont appear.
        sql += " UNION ALL \
                select -1 as rowid, '' as keyword, '' as user, '' as week, case when C.dateSzLastTrello is null then '' else substr(C.dateSzLastTrello,0,8) end as month, 0 as spent, 0 as est, \
                0 as estFirst, \
                case when C.dateSzLastTrello is null then 0 else cast(strftime('%s',C.dateSzLastTrello) as INTEGER) end as date , '' as comment, C.idCard as idCardH, C.idBoard as idBoardH, \
                T.idTeam as idTeamH, T.name as nameTeam,T.nameShort as nameTeamShort, L.name as nameList, L.pos as posList, C.name as nameCard, C.idShort as idShort, B.name as nameBoard, " + ETYPE_NONE + " as eType, \
                CASE WHEN (C.bArchived+B.bArchived+L.bArchived)>0 then 1 else 0 end as bArchivedCB, C.bDeleted as bDeleted, C.dateDue as dateDue \
                FROM CARDS as C \
                JOIN LISTS as L on C.idList=L.idList \
                JOIN BOARDS B on C.idBoard=B.idBoard \
                LEFT OUTER JOIN TEAMS T on B.idTeam=T.idTeam";
        //rebuild filters again because table names are different
        state.cFilters = 0;
        sql += buildAllParams(state, false);
    }


    sql += " order by date " + (g_bBuildSqlMode ? "ASC" : "DESC"); //REVIEW: by date is needed for g_bBuildSqlMode, but otherwise why?

    return { sql: sql, values: state.values, bByROpt: bByROpt, bHasUnion: bHasUnion };
}

function configReport(elemsParam, bRefreshPage, bOnlyUrl) {
    var elems = cloneObject(elemsParam);
    if (elems["eType"] == "all") //do this before updateUrlState so it doesnt include this default in the url REVIEW zig change so its elem value IS "" (see sinceDate)
        elems["eType"] = ""; //this prevents growing the URL with the default value for eType

    if (elems["deleted"] == "")
        elems["deleted"] = "0"; //default to "Not deleted"

    if (elems["archived"] == "")
        elems["archived"] = "0"; //default to "Not archived"

    if (elems["checkNoCrop"] == "false")
        elems["checkNoCrop"] = ""; //ditto like eType

    if (elems["checkNoCharts"] == "false")
        elems["checkNoCharts"] = ""; //ditto

    if (elems["checkNoColorsChartCount"] == "false")
        elems["checkNoColorsChartCount"] = ""; //ditto
    
    if (elems["checkNoLabelColors"] == "false")
        elems["checkNoLabelColors"] = ""; //ditto like eType

    if (elems["checkOutputCardShortLink"] == "false")
        elems["checkOutputCardShortLink"] = ""; //ditto like eType

    if (elems["checkOutputBoardShortLink"] == "false")
        elems["checkOutputBoardShortLink"] = ""; //ditto like eType

    if (elems["checkOutputCardIdShort"] == "false")
        elems["checkOutputCardIdShort"] = ""; //ditto like eType

    if (!g_bBuildSqlMode) {
        if (g_bAddParamSetLastRowViewedToQuery) {
            elems["setLastRowViewed"] = "true";
        }
        updateUrlState(elems);
    }

    if (bOnlyUrl)
        return;
    if (!g_bBuildSqlMode)
        setBusy(true);
    if (bRefreshPage) {
        assert(!g_bBuildSqlMode);
        //we do this because jquery/DOM accumulates RAM from old table contents, which also take a long time to clear.
        //instead, just reload the page. clears RAM and speeds it up.
        location.reload(true);
        return;
    }


    var sqlQuery = buildSql(elems);
    if (g_bBuildSqlMode) {
        window.parent.setSql(sqlQuery.sql, sqlQuery.values);
        return;
    }

    openPlusDb(
			function (response) {
			    if (response.status != STATUS_OK) {
			        showError(response.status);
			        return;
			    }
			    getSQLReport(sqlQuery.sql, sqlQuery.values,
					function (response) {
					    if (response.status != STATUS_OK) {
					        showError(response.status);
					        return;
					    }
					    var rows = response.rows;
					    try {
					        var groupBy = elems["groupBy"];
					        var options = {
					            bNoTruncate: elems["checkNoCrop"] == "true",
					            bNoLabelColors: g_bProVersion && elems["checkNoLabelColors"] == "true",
					            bOutputCardShortLink: g_bProVersion && elems["checkOutputCardShortLink"] == "true",
					            bOutputBoardShortLink: g_bProVersion && elems["checkOutputBoardShortLink"] == "true",
					            bOutputCardIdShort: g_bProVersion && elems["checkOutputCardIdShort"] == "true",
					            bCountCards: (groupBy.length > 0 && groupBy.indexOf("idCardH")<0)
					        };

					        setReportData(rows, options, elems, sqlQuery);
					    }
					    catch (e) {
					        var strError = "error: " + e.message;
					        showError(strError);
					    }
					});
			});
}

function resetQueryButton(btn) {
    setBusy(false);
    setBusy(false, btn);
    btn.removeAttr('disabled');
    btn.text("Query");
}

function markDuplicateCardRows(rows) {
    var mapIdCards = {};
    const cLength = rows.length;
    var row;
    for (var i = 0; i < cLength; i++) {
        row = rows[i];
        assert(row.idCardH);
        if (row.rowid !== -1) {
            if (!mapIdCards[row.idCardH])
                mapIdCards[row.idCardH] = {};
            mapIdCards[row.idCardH].bSE = true;
        } else {
            if (!mapIdCards[row.idCardH])
                mapIdCards[row.idCardH] = {};
            assert(mapIdCards[row.idCardH].i === undefined);
            mapIdCards[row.idCardH].i = i;
        }
    }

    //looping on cards is faster than looping all rows.
    //REVIEW see comment where the SQL UNION is made. we could avoid this 2nd pass with two separate queries, but might not be worth it
    var item;
    for (idCard in mapIdCards) {
        item = mapIdCards[idCard];
        if (item.bSE && item.i !== undefined)
            rows[item.i].bDup=true;
    }
}

function setReportData(rowsOrig, options, urlParams, sqlQuery) {
    var rowsGrouped = rowsOrig;
    var groupBy = urlParams["groupBy"];
    var orderBy = urlParams["orderBy"];
    var bCountCards = options.bCountCards;

    if (sqlQuery.bHasUnion) {
        assert(groupBy.length > 0);
        markDuplicateCardRows(rowsOrig);
    }

    if (groupBy.length > 0 || (orderBy.length > 0 && orderBy != "date"))
        rowsGrouped = groupRows(rowsOrig, groupBy, orderBy, bCountCards);

    var bShowCard = (groupBy == "" || groupBy.indexOf("idCardH") >= 0); //review zig: dup elsewhere
    var mapIdCards = {};
    var idCards = [];

    if (!bShowCard) {
        fillDOM();
    }
    else {
        rowsGrouped.forEach(function (row) {
            if (!mapIdCards[row.idCardH]) {
                mapIdCards[row.idCardH] = true;
                idCards.push("'" + row.idCardH + "'");
            }
        });
        idCards.sort();
        var sql = "SELECT idCardShort,idLabel FROM LABELCARD";
        var bWhere = false;
        var paramsSql = [];
        if (idCards.length < 3000) {
            //avoid making a huge query string when there are too many cards. limit to 3000 as it wasnt tested with over 4000
            sql = sql + " WHERE idCardShort IN (" + idCards.join() + ")";
            bWhere = true;
        }
        if (g_bDummyLabel) {
            if (bWhere)
                sql = sql + " AND";
            else {
                sql = sql + " WHERE";
                bWhere = true;
            }
            sql = sql + " idLabel<>?";
            paramsSql.push(IDLABEL_DUMMY);
        }
        sql = sql + " ORDER BY idCardShort DESC, idLabel DESC";
        getSQLReport(sql, paramsSql, function (response) {
            if (response.status != STATUS_OK) {
                alert(response.status);
                return;
            }
            var rowsLC = response.rows;
            var mapIdLabels = {};
            var idLabels = [];
            var mapCardsToLabels = {};
            rowsLC.forEach(function (row) {
                if (!mapIdLabels[row.idLabel]) {
                    mapIdLabels[row.idLabel] = true;
                    idLabels.push("'" + row.idLabel + "'");
                }
                var mapCTL = mapCardsToLabels[row.idCardShort];
                if (!mapCTL) {
                    mapCTL = { idLabels: [] };
                    mapCardsToLabels[row.idCardShort] = mapCTL;
                }
                mapCTL.idLabels.push(row.idLabel);
            });

            var mapLabelNames = {};
            var mapLabelColors = {};
            sql = "SELECT idLabel,name,color FROM LABELS WHERE idLabel in (" + idLabels.join() + ")";
            getSQLReport(sql, [], function (response) {
                if (response.status != STATUS_OK) {
                    alert(response.status);
                    return;
                }
                response.rows.forEach(function (rowLabel) {
                    mapLabelNames[rowLabel.idLabel] = rowLabel.name;
                    mapLabelColors[rowLabel.idLabel] = rowLabel.color || "#b6bbbf"; //trello's no-color color
                });

                var iLabel = 0;
                for (var idCardLoop in mapCardsToLabels) {
                    var objLoop = mapCardsToLabels[idCardLoop];
                    var rgLabels = new Array(objLoop.idLabels.length);
                    var rgLabelsDecorated = new Array(objLoop.idLabels.length);
                    iLabel = 0;

                    objLoop.idLabels.forEach(function (idLabel) {
                        rgLabels[iLabel] = { name: mapLabelNames[idLabel], idLabel: idLabel };
                        iLabel++;
                    });

                    rgLabels.sort(function (a, b) {
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                    });

                    if (options.bNoLabelColors) {
                        objLoop.labels = rgLabels.map(function (val) {
                            return val.name;
                        }).join(', ');
                    }
                    else {
                        iLabel = 0;
                        rgLabels.forEach(function (label) {
                            var colorTextLabel = colorContrastWith(mapLabelColors[label.idLabel], null, "#000000");
                            var strClassText = "";
                            if (colorTextLabel == "white") {
                                strClassText = "report_class_white_text ";
                            }
                            rgLabelsDecorated[iLabel] = '<span class="' + strClassText + 'report_label_color" style="background-color:' + mapLabelColors[label.idLabel] + ';">' + mapLabelNames[label.idLabel] + '</span>';
                            iLabel++;
                        });

                        objLoop.labels = rgLabelsDecorated.join('&nbsp;&nbsp;');
                    }
                }
                fillDOM(mapCardsToLabels);
            });
        });
    }

    function fillDOM(mapCardsToLabels) {
        var bShowMonth = (urlParams["sinceSimple"].toUpperCase() == FILTER_DATE_ADVANCED.toUpperCase() && (urlParams["monthStart"].length > 0 || urlParams["monthEnd"].length > 0));
        var headersSpecial = {};
        var html = getHtmlDrillDownTooltip(rowsGrouped, mapCardsToLabels, headersSpecial, options, groupBy, orderBy, urlParams["eType"], urlParams["archived"], urlParams["deleted"], bShowMonth, sqlQuery.bByROpt);
        var parentScroller = $(".agile_report_container");
        var container = makeReportContainer(html, 1300, true, parentScroller, true);
        var tableElem = $(".tablesorter");
        var bDoSort = true;
        if (tableElem.length > 0 && rowsGrouped.length > 0) {
            var sortList = [];
            if (g_sortListNamed) {
                //some scenarios could end up pointing to nonexistent rows from a previous saved report
                sortList = namedToIndexedSortList(g_sortListNamed, tableElem);
            }

            if (sortList.length == 0 && orderBy) {
                var elemMatch = $('#orderBy option').filter(function () { return $(this).val() == orderBy; });
                if (elemMatch.length > 0) {
                    var textSort = getCleanHeaderName(elemMatch[0].innerText);
                    var ascdesc = 0;
                    if (orderBy != "dateDue" && (orderBy == "date" || typeof (rowsGrouped[0][orderBy]) != "string"))
                        ascdesc = 1;

                    //dont update g_sortListNamed as this is not an explicit custom sort, it just came from the filter combo
                    //in reality it shouldnt make a difference but not updating it just to reduce code change impact
                    sortList = namedToIndexedSortList([[textSort, ascdesc]], tableElem);
                    bDoSort = false;
                }
            }
            tableElem.tablesorter({
                sortList: sortList,
                bDoSort: bDoSort,
                headers: headersSpecial
            });

            tableElem.bind("sortEnd", function () {
                var elem = this;
                if (elem && elem.config && elem.config.sortList && elem.config.headerList) {
                    var params = getUrlParams();
                    g_sortListNamed = indexedToNamedSortList(elem.config.sortList, tableElem);
                    params[g_namedParams.sortListNamed] = JSON.stringify(g_sortListNamed);
                    configReport(params, false, true);
                }
            });
        }


        var btn = $("#buttonFilter");
        resetQueryButton(btn);
        fillPivotTables(rowsOrig, $(".agile_report_container_byUser"), $(".agile_report_container_byBoard"), urlParams, options.bNoTruncate);
        saveDataChart(rowsGrouped, urlParams, options);
        selectTab(g_iTabCur); //select again to adjust height
        if (g_bNeedSetLastRowViewed) {
            g_bNeedSetLastRowViewed = false;
            configureLastViewedRowButton();
            g_bAddParamSetLastRowViewedToQuery = true;
        }
    }
}

function indexedToNamedSortList(list, table) {

    var cols = []; //array
    var iCol = 0;
    table.find("thead tr th").each(function () {
        var txt = getCleanHeaderName($(this)[0].innerText);
        cols[iCol] = txt;
        iCol++;
    });

    var ret = [];
    list.forEach(function (elem) {
        if (elem[0] >= cols.length)
            return;
        var txt = cols[elem[0]];
        ret.push([txt, elem[1]]);
    });
    return ret;
}

function namedToIndexedSortList(list, table) {

    var cols = {}; //object
    var iCol = 0;
    table.find("thead tr th").each(function () {
        var txt = getCleanHeaderName($(this)[0].innerText).toLowerCase();
        cols[txt] = iCol;
        iCol++;
    });

    var ret = [];
    list.forEach(function (elem) {
        if (elem.length != 2 || typeof (elem[0]) != "string")
            return;
        var iFound = cols[elem[0].toLowerCase()];
        if (iFound === undefined)
            return;
        ret.push([iFound, elem[1]]);
    });
    return ret;
}


function configureLastViewedRowButton() {
    var keyLastSyncViewed = "rowidLastHistorySyncedViewed";

    chrome.storage.local.get([keyLastSyncViewed], function (obj) {
        var rowidLastSync = obj[keyLastSyncViewed];

        if (rowidLastSync !== undefined && g_rowidLastSyncRemember < 0)
            g_rowidLastSyncRemember = rowidLastSync; //needed when user already marked all as viewed, so there are no rows.
        var buttonMarkRead = $("#buttonMarkallRead");
        buttonMarkRead.show();
        $("#afterRow").prop('disabled', true);
        buttonMarkRead.off().click(function () {
            buttonMarkRead.attr('disabled', 'disabled');
            setLastViewedRow();
        });
    });
}

function setLastViewedRow() {
    var keyLastSyncViewed = "rowidLastHistorySyncedViewed";

    function finish() {
        sendExtensionMessage({ method: "updatePlusIcon" }, function (response) { });
        var params = {};
        g_bAddParamSetLastRowViewedToQuery = false;
        params[g_namedParams.dontQuery] = "1";
        params[g_namedParams.markAllViewed] = "1";
        params["sinceSimple"] = "w-4";
        configReport(params, true);
    }

    chrome.storage.local.get([keyLastSyncViewed], function (obj) {
        var rowidLastSyncViewed = obj[keyLastSyncViewed];
        //prevent an old report from overwritting a newer viewed row
        if (rowidLastSyncViewed !== undefined && rowidLastSyncViewed >= g_rowidLastSyncRemember) {
            finish();
            return;
        }

        var pair = {};
        pair[keyLastSyncViewed] = g_rowidLastSyncRemember;
        chrome.storage.local.set(pair, function () {
            finish();
        });
    });
}

var g_chartContainer = null;
var g_dataChart = null; //gets nulled after making the chart
var g_dataLength = 0; //this one wont get nulled
const g_yFieldSeparator = "\n";

function saveDataChart(rows, urlParams, options) {
    //remove any possible previous leftover
    g_chartContainer = null;
    g_dataChart = null;
    g_dataLength = 0;
    const groupBy = urlParams["groupBy"];
    const bAllDates = (urlParams["sinceSimple"] == "");
    const bSingleBoard = (!!urlParams["idBoard"]);
    const bRemain = (urlParams["orderBy"] == "remain");

    if (!groupBy || urlParams["checkNoCharts"] == "true") {
        return;
    }
    
    var textMessage = "";
    var pGroups = groupBy.split("-");
    var pCur;
    var prependIds = [];
    var bDateGroups = false;
    var strNameBoardSingle = "";
    //convert to the actual display field
    for (var iProp = 0; iProp < pGroups.length; iProp++) {
        pCur = pGroups[iProp];
        var bId = true;
        var bStop = false;
        if (pCur == "idCardH") {
            pGroups[iProp] = "nameCard";
            if (pGroups.length == 1 && !bSingleBoard) {
                //special case this grouping so the board name shows too
                pGroups.push("nameBoard");
                bStop = true; //so it wont proceess this extra
            }
        }
        else if (pCur == "idTeamH")
            pGroups[iProp] = "nameTeam";
        else if (pCur == "idBoardH")
            pGroups[iProp] = "nameBoard";
        else
            bId = false;

        if (pCur.indexOf("date") == 0)
            bDateGroups = true;
        //use prepend ids to cover cases where two domain parts are identical (like two cards with the same title)
        //Thus, all parts are prepended with the ids where they came from.
        if (bId)
            prependIds.push(pCur);
        if (bStop)
            break;
    }

    var dataS = [];
    var dataR = [];
    var dataE = [];
    var dataEFirst = [];
    var domain = [];
    var dataCountCards = [];
    const bShowR = (bAllDates && !bDateGroups);
    var bHasNegativeR = false;
    var bHasNegatives = false;
    var iPartGroupExclude = -1;
    var mapDomains = {};
    for (var iRow = 0; iRow < rows.length; iRow++) {
        var yField = "";
        var rowCur = rows[iRow];
        for (iProp = 0; iProp < pGroups.length; iProp++) {
            var propNameLoop = pGroups[iProp];
            if (bSingleBoard && propNameLoop == "nameBoard") {
                iPartGroupExclude=iProp;
                continue;
            }
            var val = (yField.length > 0 ? g_yFieldSeparator : "") + (rowCur[propNameLoop] || "-");
            yField += val;
        }
		//NOTE: code uses "dlabel" (data label) to distinguish from trello labels.
        //All dlabels will always contain two parts, separated by REPORTCHART_DLABEL_PREPENDSEP
        //the first part, if not empty, contains a unique string made from the prependIds
        var prepend = "";
        var bPushDomain = false;

        for (iProp = 0; iProp < prependIds.length; iProp++) {
            prepend = prepend + "+" + (rowCur[prependIds[iProp]] || "");
        }

        yField = prepend + REPORTCHART_DLABEL_PREPENDSEP+yField;
        
        if (bSingleBoard && strNameBoardSingle.length == 0)
            strNameBoardSingle = rowCur.nameBoard;
        //datasets

        if (options.bCountCards) {
            dataCountCards.push({ x: rowCur.countCards, y: yField });
            bPushDomain = true;
        }

        if (bRemain || (rowCur.spent != 0 || (bShowR && rowCur.est != 0))) {
            if (!bRemain && rowCur.spent != 0) {
                dataS.push({ x: parseFixedFloat(rowCur.spent), y: yField });
                if (rowCur.spent < 0)
                    bHasNegatives = true;
            }
            if (bShowR) {
                var rCalc = parseFixedFloat(rowCur.est - rowCur.spent);
                if (g_bAllowNegativeRemaining && rCalc < 0) {
                    null; //makes no sense in a stacked chart but at least warns the user
                } else if (rCalc != 0) {
                    if (rCalc < 0)
                        bHasNegatives = true;
                    dataR.push({ x: rCalc, y: yField });
                }
            }
            bPushDomain = true;
        }

        if (rowCur.est != 0 || rowCur.estFirst != 0) {
            //push always together even if some are zero, as later elements must correspond in both sets
            dataE.push({ x: parseFixedFloat(rowCur.est), y: yField });
            dataEFirst.push({ x: parseFixedFloat(rowCur.estFirst), y: yField });
            bPushDomain = true;
        }

        if (yField && bPushDomain && !mapDomains[yField]) {
            domain.push(yField);
            mapDomains[yField] = true;
        }
    }

    g_dataChart = {
        dataS: dataS,
        dataR: dataR,
        dataCountCards: dataCountCards,
        dataE: dataE,
        dataEFirst: dataEFirst,
        domain: domain,
        bShowR: bShowR,
        bRemain: bRemain,
        bHasNegatives: bHasNegatives,
        cPartsGroupFinal: pGroups.length-(iPartGroupExclude>=0?1:0),
        params: urlParams,
        iPartGroupExclude: iPartGroupExclude,
        strNameBoardSingle: strNameBoardSingle
    };
    
    g_dataLength = Math.max(g_dataChart.dataS.length,
                            g_dataChart.dataR.length,
                            g_dataChart.dataCountCards.length,
                            g_dataChart.dataE.length,
                            g_dataChart.dataEFirst.length);

    return;
}

const REPORTCHART_DLABEL_PREPENDSEP = "|"; //cant be / as unknown ids contain that
function bCancelFromAlertLargeSize(bDownloading) {
    const MAX_BARS = 200;
    if (g_dataLength > MAX_BARS) {
        var strAlert = "The charts will have " + g_dataLength + " bars.";
        if (bDownloading)
            strAlert += "\n" + "Converting a large chart to PDF may fail.";
        strAlert += "\nAre you sure?";
        if (!confirm(strAlert))
            return true; //cancel
    }
    return false; //dont cancel
}

var g_lastChartFilled = "";
function fillChart() {
    var typeChart = $("#chartView").val();
    var elemStack = $("#stackCount");
    var elemSpancheckNoColorsChartCount = $("#spancheckNoColorsChartCount");
    if (typeChart == g_chartViews.cardcount) {
        elemStack.show();
        elemSpancheckNoColorsChartCount.show();
    }
    else {
        elemSpancheckNoColorsChartCount.hide();
        elemStack.hide();
    }

    if (!g_dataChart)
        return;


    if (g_lastChartFilled == typeChart)
        return;

    if (bCancelFromAlertLargeSize(false))
        return;

    g_lastChartFilled = typeChart;
    
    if (typeChart == g_chartViews.ser)
        chartSER();
    else if (typeChart == g_chartViews.cardcount) {
        chartCountCards();
    }
    else if (typeChart == g_chartViews.e1vse)
        charte1vse();
    else if (typeChart == g_chartViews.echange)
        charteChange();
}

const DLABELPART_SKIP = " ";

function dlabelRealFromEncoded(dlabel) {
    var iSlash = dlabel.indexOf(REPORTCHART_DLABEL_PREPENDSEP); //skip prependIds
    var dlabelReal = dlabel.substring(iSlash + 1);
    var parts = dlabelReal.split(g_yFieldSeparator);
    var dlabelDisplay = "";
    for (var iPart = 0; iPart < parts.length; iPart++) {
        var valPart = parts[iPart];
        if (valPart == DLABELPART_SKIP)
            continue;
        if (iPart > 0)
            dlabelDisplay += g_yFieldSeparator;
        dlabelDisplay += strTruncate(parts[iPart] || "-", g_cchTruncateChartDlabel);
    }
    return dlabelDisplay;
}

function getCommonChartParts(dataChart, domain, colorsForScale, legendTexts) {
    var ret = {};
    ret.colorScale = new Plottable.Scales.Color().domain(legendTexts);
    if (colorsForScale)
        ret.colorScale.range(colorsForScale);
    ret.legend = new Plottable.Components.Legend(ret.colorScale).xAlignment("center").yAlignment("top");
    ret.yScale = new Plottable.Scales.Category().domain(domain);
    ret.xScale = new Plottable.Scales.Linear();
    ret.xAxis = new Plottable.Axes.Numeric(ret.xScale, "bottom");

    ret.yAxis = new Plottable.Axes.Category(ret.yScale, "left").formatter(function (text) {
        return dlabelRealFromEncoded(text);
    });

    return ret;
}

function getCleanChartElem() {
    if (g_chartContainer) {
        g_chartContainer.destroy();
        g_chartContainer = null;
    }
    var elemChart = $("#chart");
    d3.select("chart").remove(); //jquery 'empty' breaks plottable interaction in card count chart
    return elemChart;
}

function prependChartTitle(table, dataChart) {
    var strTitle="";
    if (dataChart.strNameBoardSingle)
        strTitle=dataChart.strNameBoardSingle;
    

    if (dataChart.domain.length == 1) {
        if (strTitle)
            strTitle += "\n";
        strTitle += dlabelRealFromEncoded(dataChart.domain[0]);
    }

    if (strTitle)
        table.unshift([null, new Plottable.Components.TitleLabel(strTitle)]);
    
    if (dataChart.domain.length == 1) {
        for (var i = 0; i < table.length; i++) {
            if (table[i][0]) {
                table[i][0] = null; //REVIEW hack. relies on yAxis always being the only in the first column
                break;
            }
        }
    }
}

function chartSER() {
    var elemChart = getCleanChartElem();

    var elemChartMessage = $("#chartMessage");
    var textMessage = "";

    if (!g_dataChart.bRemain) {
        if (g_dataChart.dataS.length == 0)
            textMessage += "There is no Spent/Estimate to chart.";
    } else {
        if (g_dataChart.dataR.length == 0)
            textMessage += "There is no Remain to chart.";
    }
    if (textMessage)
        textMessage += " Try the 'Card count' chart from the list above.";
    elemChartMessage.text(textMessage);
    if (textMessage.length>0)
        return;

    var colors = ["#D25656"];
    var legendTexts = ["Spent"];
    if (g_dataChart.bShowR) {
        colors.push("#519B51");
        legendTexts.push("Remain");
    }
    var common = getCommonChartParts(g_dataChart, g_dataChart.domain, g_dataChart.bRemain ? [colors[1]] : colors
        , g_dataChart.bRemain ? [legendTexts[1]] : legendTexts);

    var datasets = {
        ds: new Plottable.Dataset(g_dataChart.dataS),
        dr: new Plottable.Dataset(g_dataChart.dataR)
    };

    var chart = new Plottable.Plots.StackedBar(Plottable.Plots.StackedBar.ORIENTATION_HORIZONTAL).
        addDataset(datasets.ds).labelsEnabled(true).addClass("chartReportStyle");
    if (false && !g_dataChart.bHasNegatives) //review caused problems in popup and with negative values (scale changed), not well tested to enable in non popup
        chart.deferredRendering(true);

    if (!g_bPopupMode)
        chart.animated(true);

    if (g_dataChart.bShowR)
        chart.addDataset(datasets.dr);

    chart.x(function (d) { return d.x; }, common.xScale).
        y(function (d) { return d.y; }, common.yScale).
        attr("fill", function (d, i, dataset) {
            return (dataset == datasets.ds ? colors[0] : colors[1]);
        });

    var table = [
      [null, common.legend],
      [common.yAxis, chart],
      [null, common.xAxis]
    ];

    prependChartTitle(table, g_dataChart);
    g_chartContainer = new Plottable.Components.Table(table);

    elemChart.attr('height', (g_dataChart.domain.length + 3) * (50 + (g_dataChart.cPartsGroupFinal < 3 ? 0 : 20 * (g_dataChart.cPartsGroupFinal - 2))));
    g_chartContainer.renderTo("#chart");
}


function charte1vse() {
    var elemChart = getCleanChartElem();

    var elemChartMessage = $("#chartMessage");
    var textMessage = "";

    if (g_dataChart.dataE.length==0) {
        textMessage += "There are no estimates to chart.";
    }
    elemChartMessage.text(textMessage);
    if (textMessage.length>0)
        return;

    addChartEstWarning(elemChartMessage);
    var colors = ["#A5D6A7", "#43A047"];
    var legendTexts = ["E 1st", "E current"];

    var common = getCommonChartParts(g_dataChart, g_dataChart.domain, colors, legendTexts);
    common.yScale.innerPadding(0).outerPadding(0);
    var datasets = {
        de1: new Plottable.Dataset(g_dataChart.dataEFirst),
        de2: new Plottable.Dataset(g_dataChart.dataE)
    };

    var chart = new Plottable.Plots.ClusteredBar(Plottable.Plots.ClusteredBar.ORIENTATION_HORIZONTAL).
        addDataset(datasets.de1).addDataset(datasets.de2).labelsEnabled(true).addClass("chartReportStyle");

    if (!g_bPopupMode)
        chart.animated(true);

    chart.x(function (d) { return d.x; }, common.xScale).
        y(function (d) { return d.y; }, common.yScale).
        attr("fill", function (d, i, dataset) {
            return (dataset == datasets.de1 ? colors[0] : colors[1]);
        });

    var table = [
      [null, common.legend],
      [common.yAxis, chart],
      [null, common.xAxis]
    ];
    prependChartTitle(table, g_dataChart);
    g_chartContainer = new Plottable.Components.Table(table);


    elemChart.attr('height', (g_dataChart.domain.length + 3) * 1.3 * (50 + (g_dataChart.cPartsGroupFinal < 3 ? 0 : 20 * (g_dataChart.cPartsGroupFinal - 2))));
    g_chartContainer.renderTo("#chart");
}

function addChartEstWarning(elemChartMessage) {
    if (g_dataChart.params["sinceSimple"]) {
        elemChartMessage.text("Note: This report is filtered by date, which may cause unexpected E/E 1st values.");
        hiliteOnce($("#sinceSimple"));
    }
}

function charteChange() {
    var elemChart = getCleanChartElem();

    var elemChartMessage = $("#chartMessage");
    var textMessage = "";

    if (g_dataChart.dataE.length == 0) {
        textMessage += "There are no estimates to chart.";
    }
    elemChartMessage.text(textMessage);
    if (textMessage.length>0)
        return;

    addChartEstWarning(elemChartMessage);

    var colors = ["#607D8B", "#f44336", "#4CAF50"];
    var legendTexts = ["E 1st", "Increased E", "Reduced E"];

    var common = getCommonChartParts(g_dataChart, g_dataChart.domain, colors, legendTexts);
    
    var dPlus = [];
    var dMinus = [];
    var dE1 = g_dataChart.dataEFirst;
    var dE2 = g_dataChart.dataE;
    var delta = 0;
    assert(dE1.length == dE2.length);
    for (var ids = 0; ids < dE1.length; ids++) {
        delta = dE2[ids].x - dE1[ids].x;
        if (delta>0)
            dPlus.push({ x: "+" + parseFixedFloat(delta), y: dE1[ids].y }); //trick: add + so it gets displayed with "+", but will still get interpreted correctly
        if (delta < 0)
            dMinus.push({ x: parseFixedFloat(delta), y: dE1[ids].y });
    }
    var datasets = {
        d0: new Plottable.Dataset(g_dataChart.dataEFirst),
        d1: new Plottable.Dataset(dPlus),
        d2: new Plottable.Dataset(dMinus)
    };

    var chart = new Plottable.Plots.StackedBar(Plottable.Plots.StackedBar.ORIENTATION_HORIZONTAL).
        addDataset(datasets.d0).addDataset(datasets.d1).addDataset(datasets.d2).labelsEnabled(true)
        .addClass("chartReportStyle");

    if (!g_bPopupMode)
        chart.animated(true);

    chart.x(function (d) { return d.x; }, common.xScale).
        y(function (d) { return d.y; }, common.yScale).
        attr("fill", function (d, i, dataset) {
            return (dataset == datasets.d0 ? colors[0] : (dataset == datasets.d1? colors[1]:colors[2]));
        }).labelFormatter(
            function (text) {
                return "" + text; //review put + on the red boxes labels. cant differenciate so far from other boxes`
            });;

    var table = [
      [null, common.legend],
      [common.yAxis, chart],
      [null, common.xAxis]
    ];
    prependChartTitle(table, g_dataChart);
    g_chartContainer = new Plottable.Components.Table(table);

    elemChart.attr('height', (g_dataChart.domain.length + 3) * (50 + (g_dataChart.cPartsGroupFinal < 3 ? 0 : 20 * (g_dataChart.cPartsGroupFinal - 2))));
    g_chartContainer.renderTo("#chart");
}

function chartCountCards() {
    var elemChart = getCleanChartElem();
    var stackBy = $("#stackCount").val();
    var bNoColors = (g_dataChart.params["checkNoColorsChartCount"] == "true");
    
    var elemChartMessage = $("#chartMessage");
    var textMessage = "";

    if (g_dataChart.dataCountCards.length == 0)
        textMessage += "There are no counts to chart. Make sure to group by other than Card or 'S/E rows'.";
    
    elemChartMessage.text(textMessage);
    if (textMessage.length>0)
        return;

    var colors = [ "#026AA7"];
    if (bNoColors) {
        colors = ["#DDDDDD", // "-"
            "#FFFFFF"];       //the rest
    }
    var legendTexts = [];
    legendTextsInfo = [{ text: "-", i: 0 }]; //review zig hipri force sort to top
    var iGroupStack=-1; //none
    if (stackBy) {
        var pGroups = g_dataChart.params["groupBy"].split("-");
        iGroupStack = pGroups.indexOf(stackBy);
        if (iGroupStack < 0) {
            sendDesktopNotification("To use this stacking, first query a report using a 'Group by' containing your stacking.",10000);
            $("#stackCount").val("");
            updateURLPart("stackCount");
        } else if (g_dataChart.iPartGroupExclude>=0 && g_dataChart.iPartGroupExclude < iGroupStack)
            iGroupStack--;
    }

    var dataCountCards = g_dataChart.dataCountCards;
    var cPartsGroupFinal = g_dataChart.cPartsGroupFinal;
    var domain = g_dataChart.domain;
    var mapLegendToIColor = {};
    
    var iColor = 1; //0 is for no hashtag
    if (iGroupStack >= 0) {
        //transform the domain and datasets

        if (!bNoColors) {
            //http://stackoverflow.com/a/4382138/2213940
            colors = ["#000000", //Black, only for empty property "-"
                    "#FF6800", // Vivid Orange
                    "#803E75", // Strong Purple
                    "#A6BDD7", // Very Light Blue
                    "#00538A", // Strong Blue
                    "#C10020", // Vivid Red
                    "#CEA262", // Grayish Yellow
                    "#817066", // Medium Gray
                    // The following don't work well for people with defective color vision
                    "#FFB300", // Vivid Yellow
                    "#007D34", // Vivid Green
                    "#F6768E", // Strong Purplish Pink
                    "#FF7A5C", // Strong Yellowish Pink
                    "#53377A", // Strong Violet
                    "#FF8E00", // Vivid Orange Yellow
                    "#B32851", // Strong Purplish Red
                    "#F4C800", // Vivid Greenish Yellow
                    "#7F180D", // Strong Reddish Brown
                    "#93AA00", // Vivid Yellowish Green
                    "#593315", // Deep Yellowish Brown
                    "#F13A13", // Vivid Reddish Orange
                    "#232C16" // Dark Olive Green
            ];
        }
        cPartsGroupFinal--;
        var mapDomainNew = {};
        var mapDlabelsNew = {};
        var domainNew = [];
        const lengthColorsOrig = colors.length;
        domain.forEach(function (dlabel) {
            var iSlash = dlabel.indexOf(REPORTCHART_DLABEL_PREPENDSEP);
            var prepend = dlabel.substring(0, iSlash + 1); //include REPORTCHART_DLABEL_PREPENDSEP
            var dlabelReal = dlabel.substring(iSlash + 1);
            var parts = dlabelReal.split(g_yFieldSeparator);
            if (iGroupStack < parts.length) {
                var partNew=parts[iGroupStack];
                parts[iGroupStack]=DLABELPART_SKIP;
                if (!mapDlabelsNew[partNew.toLowerCase()]) {
                    mapDlabelsNew[partNew.toLowerCase()] = true;
                    
                    if (partNew != "-") {
                        legendTextsInfo.push({ text: partNew, i: iColor });
                        iColor++;
                        if (iColor >= colors.length)
                            colors.push(colors[(iColor % (lengthColorsOrig-1))+1]);
                    }
                }
            } else {
                console.log("Unexpected parts on iGroupStack");
            }
            var elemNew=prepend+parts.join(g_yFieldSeparator);
            if (!mapDomainNew[elemNew]) {
                mapDomainNew[elemNew] = true;
                domainNew.push(elemNew);
            }

        });

        legendTextsInfo.sort(function (a, b) {
            var at = a.text;
            var bt = b.text;
            const legendEmpty = "-";
            if (at != bt) {
                //force sort
                if (at == legendEmpty)
                    return -1;
                if (bt == legendEmpty)
                    return 1;
            }
            return at.toLowerCase().localeCompare(bt.toLowerCase());
        });

        for (var iSet = 0; iSet < legendTextsInfo.length; iSet++) {
            var textSet=legendTextsInfo[iSet].text;
            legendTexts.push(textSet);
            mapLegendToIColor[textSet.toLowerCase()] = iSet;
        }
        domain = domainNew;
    }

    var common = getCommonChartParts(g_dataChart, domain, colors, legendTexts);
    if (bNoColors)
        common.legend = null;
    common.xScale.tickGenerator(Plottable.Scales.TickGenerators.integerTickGenerator());
    
    var datasets = {};
    for (var iDS = 0; iDS < dataCountCards.length; iDS++) {
        var itemCur=dataCountCards[iDS];
        var dlabel = itemCur.y;
        //{ x: rowCur.countCards, y: yField };
        var iSlash = dlabel.indexOf(REPORTCHART_DLABEL_PREPENDSEP);
        var prepend = dlabel.substring(0, iSlash + 1); //include REPORTCHART_DLABEL_PREPENDSEP
        var dlabelReal = dlabel.substring(iSlash + 1);
        var parts = dlabelReal.split(g_yFieldSeparator);
        var partNew = "-"; //index when no stacking
        if (iGroupStack >= 0) {
            if (iGroupStack < parts.length) {
                partNew = parts[iGroupStack];
                parts[iGroupStack] = DLABELPART_SKIP;
            }  else {
                console.log("Unexpected parts on iGroupStack");
            }
        }
        assert(partNew);
        if (!datasets[partNew])
            datasets[partNew] = [];
        
        datasets[partNew].push({ x: itemCur.x, y: prepend + parts.join(g_yFieldSeparator), iColor: mapLegendToIColor[partNew.toLowerCase()] });
    }

    var chart = new Plottable.Plots.StackedBar(Plottable.Plots.StackedBar.ORIENTATION_HORIZONTAL).
        labelsEnabled(true).addClass("chartReportStyle");

    for (iSet = 0; iSet < legendTextsInfo.length; iSet++) {
        var dsAdd = datasets[legendTextsInfo[iSet].text];
        if (dsAdd)
            chart.addDataset(new Plottable.Dataset(dsAdd));
    }
    if (!g_bPopupMode)
        chart.animated(true);

    chart.x(function (d) { return d.x; }, common.xScale).
        y(function (d) { return d.y; }, common.yScale).
        attr("fill", function (d) {
            var iColor = d.iColor || 0;
            if (bNoColors && iColor > 0)
                return colors[1];
            return colors[iColor % colors.length];
        });


    var table = null;

    if (iGroupStack >= 0) {
        table = [
      [common.yAxis, chart, common.legend],
      [null, common.xAxis, null]
        ];
    } else {
        table = [
          [null, common.legend],
          [common.yAxis, chart],
          [null, common.xAxis]
        ];
    }

    prependChartTitle(table, g_dataChart);
    g_chartContainer = new Plottable.Components.Table(table);
    if (bNoColors)
        chart.attr("stroke", "black");
    elemChart.attr('height', (domain.length + 3) * (50 + (cPartsGroupFinal < 3 ? 0 : 15 * (cPartsGroupFinal - 2))));
    g_chartContainer.renderTo("#chart");
    if (iGroupStack >= 0) {
        var elemTooltip = $("#tooltipChart");
        // Setup Interaction.Pointer
        var pointer = new Plottable.Interactions.Pointer(); //review: unknown why the interaction is lost after switching to another chart and back here
        pointer.onPointerMove(function (p) {
            var bHide = true;
            var closest = chart.entitiesAt(p);
            if (closest && closest[0]) {
                closest = closest[0];
                if (closest.datum != null) {
                    elemTooltip.css("left", p.x + elemChart.offset().left + common.yAxis._width + 20);
                    elemTooltip.css("top", closest.position.y + elemChart.offset().top);
                    var iColor = 0;
                    if (typeof (closest.datum.iColor) !== "undefined")
                        iColor = closest.datum.iColor;
                    elemTooltip.html(escapeHtml(legendTexts[iColor]) + "<br \>" + closest.datum.x);
                    elemTooltip.show();
                    bHide = false;
                }
            }
            if (bHide)
                elemTooltip.hide();
        });

        pointer.onPointerExit(function () {
            elemTooltip.hide();
        });

        pointer.attachTo(chart);
    }
}

function fillPivotTables(rows, elemByUser, elemByBoard, urlParams, bNoTruncate) {
    var pivotBy = urlParams["pivotBy"];
    var bPivotByMonth = (pivotBy == PIVOT_BY.month);
    var bPivotByWeek = (pivotBy == PIVOT_BY.week);
    var bPivotByDate = (pivotBy == PIVOT_BY.day);
    var bPivotByYear = (pivotBy == PIVOT_BY.year);
    var tables = calculateTables(rows, pivotBy);
    //{ header: header, tips: tips, byUser: rgUserRows, byBoard: rgBoardRows };
    var parent = elemByUser.parent();
    var dyTop = 70;
    var strTh = "<th class='agile_header_pivot agile_pivotCell'>";
    var strTd = '<td class="agile_nowrap agile_pivotCell">';
    var strTable = "<table class='agile_table_pivot' cellpadding=2 cellspacing=0>";
    var elemTableUser = $(strTable);
    var trUser = $("<tr>");
    var elemTableBoard = $(strTable);
    var trBoard = $("<tr>");
    var replaces = [];
    var pivotStart = "weekStart";
    var pivotEnd = "weekEnd";

    if (bPivotByMonth || bPivotByYear) {
        pivotStart = "monthStart";
        pivotEnd = "monthEnd";
    }

    function handleClickZoom(table) {
        table[0].addEventListener('click',
	  function (ev) {
	      var t = ev.target;

	      var elemThis = $(t).closest('th,td');
	      var data = elemThis.data("agile_reportzoom");
	      if (!data)
	          return;

	      var params = getUrlParams();
	      for (var i = 0; i < data.replaces.length; i++) {
	          var rep = data.replaces[i];
	          params[rep.name] = rep.value;
	      }

	      if (data.bPivotByWeek || data.bPivotByMonth)
	          params["pivotBy"] = PIVOT_BY.day;
	      else if (data.bPivotByYear)
	          params["pivotBy"] = PIVOT_BY.month;
	      else
	          params["tab"] = 0;

	      if (data.bRemoveSimpleDateFilter)
	          params["sinceSimple"] = FILTER_DATE_ADVANCED;

	      if (ev.ctrlKey) {
	          window.open(buildUrlFromParams(params, true), '_blank');
	      }
	      else {
	          delete params[g_namedParams.namedReport];
	          window.location.href = buildUrlFromParams(params);
	      }
	  }, false);
    }

    function addClickZoom(tdElem, urlParams, replaces, bRemoveSimpleDateFilter, title) {
        title = title || "";
        if (title != "")
            tdElem.prop("title", title);

        if (bPivotByDate)
            return; //REVIEW todo

        //note: would be better to use anchors but I couldnt get them to be clickable in the whole cell so I went back
        //to using a click handler on the cell	
        tdElem.css("cursor", "-webkit-zoom-in");
        tdElem.addClass("agile_hoverZoom");
        //offload creating zoom url to the moment the cell is clicked. that way we get the correct iTab and possible url modifications from elsewhere
        var data = {
            replaces: replaces,
            bPivotByWeek: bPivotByWeek,
            bPivotByMonth: bPivotByMonth,
            bPivotByYear: bPivotByYear,
            bRemoveSimpleDateFilter: bRemoveSimpleDateFilter
        };
        tdElem.data("agile_reportzoom", data);
    }

    handleClickZoom(elemTableUser);
    handleClickZoom(elemTableBoard);
    var iCol = 0;
    var val = null;
    var tdElem = null;
    var strHeader = null;

    //HEADERS
    for (; iCol < tables.header.length; iCol++) {
        val = tables.header[iCol];
        var tdUser = $(strTh).text(val).attr("title", tables.tips[iCol]);
        var tdBoard = $(strTh).text(val).attr("title", tables.tips[iCol]);
        if (!bPivotByDate) {
            replaces = [{ name: pivotStart, value: val }, { name: pivotEnd, value: val }];
            if (val.length > 0) {
                addClickZoom(tdUser, urlParams, replaces, true);
                addClickZoom(tdBoard, urlParams, replaces, true);
            }
        }
        if (iCol == 0) {
            tdUser.text("User");
            tdBoard.text("Board");
        }
        trUser.append(tdUser);
        trBoard.append(tdBoard);
    }
    elemTableUser.append(trUser);
    elemTableBoard.append(trBoard);


    var bLastRow = false;
    //BY USER
    var iRow = 0;
    for (; iRow < tables.byUser.length; iRow++) {
        trUser = $("<tr>");
        var valUser = tables.byUser[iRow][0];
        var tdUserCol = $(strTd).text(valUser).addClass("agile_pivotFirstCol");
        trUser.append(tdUserCol);

        bLastRow = (iRow == tables.byUser.length - 1);

        if (!bLastRow) {
            replaces = [{ name: "user", value: valUser }];
            addClickZoom(tdUserCol, urlParams, replaces, false);
        }
        else {
            tdUserCol.css("font-weight", "bold");
            tdUserCol.css("text-align", "right");
        }

        for (iCol = 1; iCol < tables.header.length; iCol++) {
            strHeader = tables.header[iCol];
            val = parseFixedFloat(tables.byUser[iRow][iCol]) || 0;
            tdElem = $(strTd).text(val).addClass("agile_pivot_value");
            if (val == 0)
                tdElem.addClass("agile_pivotCell_Zero");
            trUser.append(tdElem);
            replaces = [{ name: pivotStart, value: strHeader }, { name: pivotEnd, value: strHeader }];
            if (bLastRow) {
                //last row
                tdElem.data("agile_total_row", "true");
                tdElem.css("font-weight", "bold");
            }
            else {
                replaces.push({ name: "user", value: valUser });
            }
            addClickZoom(tdElem, urlParams, replaces, true, strHeader + "    " + valUser);
            if (bPivotByWeek)
                tdElem.data("agile_week", strHeader);

        }
        elemTableUser.append(trUser);
    }

    //BY BOARD
    for (iRow = 0; iRow < tables.byBoard.length; iRow++) {
        trBoard = $("<tr>");
        var nameBoard = tables.byBoard[iRow][0].name || ""; //total rows dont have names
        if (!bNoTruncate)
            nameBoard = strTruncate(nameBoard);
        var tdBoardCol = $(strTd).text(nameBoard).addClass("agile_pivotFirstCol");
        trBoard.append(tdBoardCol);
        var valIdBoard = tables.byBoard[iRow][0].idBoard;

        bLastRow = (iRow == tables.byBoard.length - 1);

        if (!bLastRow) {
            replaces = [{ name: "idBoard", value: valIdBoard }];
            addClickZoom(tdBoardCol, urlParams, replaces, false);
        }
        else {
            tdBoardCol.css("font-weight", "bold");
            tdBoardCol.css("text-align", "right");
        }

        for (iCol = 1; iCol < tables.header.length; iCol++) {
            strHeader = tables.header[iCol];
            val = parseFixedFloat(tables.byBoard[iRow][iCol]) || 0;
            tdElem = $(strTd).text(val).addClass("agile_pivot_value");
            if (val == 0)
                tdElem.addClass("agile_pivotCell_Zero");
            trBoard.append(tdElem);
            replaces = [{ name: pivotStart, value: strHeader }, { name: pivotEnd, value: strHeader }];
            var titleCur = strHeader + "    " + nameBoard;

            if (bLastRow) {
                //last row
                tdElem.data("agile_total_row", "true");
                tdElem.css("font-weight", "bold");
            }
            else {
                replaces.push({ name: "idBoard", value: valIdBoard });
            }
            addClickZoom(tdElem, urlParams, replaces, true, titleCur);
            if (bPivotByWeek)
                tdElem.data("agile_week", strHeader); //used later to detect current week column
        }
        elemTableBoard.append(trBoard);
    }

    elemByUser.empty();
    elemByBoard.empty();
    elemByUser.append(elemTableUser);
    elemByBoard.append(elemTableBoard);
    configAllPivotFormats();
}

function configAllPivotFormats() {
    if (g_bBuildSqlMode)
        return;
    configPivotFormat($("#tabs-1 .agile_format_container"), g_dataFormatUser, $(".agile_report_container_byUser"), ITAB_BYUSER);
    configPivotFormat($("#tabs-2 .agile_format_container"), g_dataFormatBoard, $(".agile_report_container_byBoard"), ITAB_BYBOARD);
}

/* calculateTables
 *
 * returns { header, tips, byUser, byBoard}, last row of byUser contains column totals
 **/
function calculateTables(rows, pivotBy) {
    var header = [""];
    var users = {};
    var boards = {};
    var i = 0;
    var iColumn = 0;
    var pivotLast = "";
    var tips = [""]; //tip for each header element
    var totalsPerPivot = [""]; //appended at the end of the user results
    var bPivotByMonth = (pivotBy == PIVOT_BY.month);
    var bPivotByWeek = (pivotBy == PIVOT_BY.week);
    var bPivotByDate = (pivotBy == PIVOT_BY.day);
    var bPivotByYear = (pivotBy == PIVOT_BY.year);

    for (; i < rows.length; i++) {
        var row = rows[i];
        if (row.spent == 0)
            continue;
        var pivotCur = row.week;
        var dateStart = new Date(row.date * 1000);

        if (bPivotByMonth) {
            pivotCur = row.month;
        }
        else if (bPivotByDate) {
            pivotCur = dateStart.toLocaleDateString();
        }
        else if (bPivotByYear)
            pivotCur = "" + dateStart.getFullYear();

        if (pivotCur != pivotLast) {
            iColumn++;
            header[iColumn] = pivotCur; //note column zero is skipped, start at 1
            pivotLast = pivotCur;
            if (bPivotByWeek) {
                dateStart.setDate(dateStart.getDate() - DowMapper.posWeekFromDow(dateStart.getDay()));
                var title = dateStart.toLocaleDateString();
                dateStart.setDate(dateStart.getDate() + 6);
                title = title + " - " + dateStart.toLocaleDateString();
                tips[iColumn] = title;
            }
            else if (bPivotByDate) {
                tips[iColumn] = getWeekdayName(dateStart.getDay()) + " " + getCurrentWeekNum(dateStart);
            }
            else if (bPivotByMonth) {
                var dateMonthStart = new Date(dateStart.getTime());
                var dateMonthEnd = new Date(dateStart.getFullYear(), dateStart.getMonth() + 1, 0);
                dateMonthStart.setDate(1);
                tips[iColumn] = getCurrentWeekNum(dateMonthStart) + " - " + getCurrentWeekNum(dateMonthEnd);
            }
            else if (bPivotByYear) {
                tips[iColumn] = "" + dateStart.getFullYear();
            }
        }
        var userRow = users[row.user];
        var bWasEmpty = (userRow === undefined);
        if (bWasEmpty)
            userRow = [row.user];
        var sumUser = userRow[iColumn] || 0;
        userRow[iColumn] = sumUser + row.spent;
        if (bWasEmpty)
            users[row.user] = userRow;

        totalsPerPivot[iColumn] = (totalsPerPivot[iColumn] || 0) + row.spent;

        var boardRow = boards[row.nameBoard];
        bWasEmpty = (boardRow === undefined);
        if (bWasEmpty)
            boardRow = [{ name: row.nameBoard, idBoard: row.idBoardH }];
        var sumBoard = boardRow[iColumn] || 0;
        boardRow[iColumn] = sumBoard + row.spent;
        if (bWasEmpty)
            boards[row.nameBoard] = boardRow;
    }


    function doSortUser(a, b) {
        return (a[0].toLowerCase().localeCompare(b[0].toLowerCase()));
    }

    function doSortBoard(a, b) {
        return (a[0].name.toLowerCase().localeCompare(b[0].name.toLowerCase()));
    }

    var rgUserRows = [];
    var rgBoardRows = [];
    for (i in users)
        rgUserRows.push(users[i]);
    rgUserRows.sort(doSortUser);

    for (i in boards)
        rgBoardRows.push(boards[i]);
    rgBoardRows.sort(doSortBoard);
    rgUserRows.push(totalsPerPivot);
    rgBoardRows.push(totalsPerPivot);
    return { header: header, tips: tips, byUser: rgUserRows, byBoard: rgBoardRows };
}


function groupRows(rowsOrig, propertyGroup, propertySort, bCountCards) {

    var ret = [];
    //group
    if (propertyGroup.length > 0) {
        var i = 0;
        var map = {};
        var mapCardsPerGroup = {};
        const cMax = rowsOrig.length;
        var pGroups = propertyGroup.split("-");
        var propDateString = "dateString"; //review zig: ugly to do it here, but elsewhere requires another pass to rowsOrig
        var propDateTimeString = "dtString";
        var row = null;
        for (; i < cMax; i++) {
            row = rowsOrig[i];

            if (row.bDup)
                continue;

            if (row.date !== undefined && (row[propDateString] === undefined || row[propDateTimeString] === undefined)) {
                var dateRow = new Date(row.date * 1000); //db is in seconds
                row[propDateString] = makeDateCustomString(dateRow);
                row[propDateTimeString] = makeDateCustomString(dateRow, true);
            }

            var key = "";
            var iProp = 0;

            for (; iProp < pGroups.length; iProp++) {
                var propname = pGroups[iProp];
                var valCur = "";
                if (propname == "hashtagFirst") {
                    var rgHash = getHashtagsFromTitle(row.nameCard || "", true);
                    if (rgHash.length > 0)
                        valCur = rgHash[0];
                    else
                        valCur = "";
                    row.hashtagFirst = valCur; //NOTE we modify the row here

                } else if (propname == "idLabelFirst") { //review implement
                    if (row[propname])
                        valCur = row[propname]; //2nd pass
                    else
                        valCur = row["idCardH"]; //1st pass review missing
                } else {
                    valCur = row[propname];
                }
                key = key + "/" + String(valCur).toLowerCase();
            }
            var group = map[key];
            if (group === undefined)
                group = cloneObject(row);
            else {
                //rowid -1 when its a card row (from the query UNION)
                if (group.rowid == -1 && row.rowid != -1) {
                    var sSave = group.spent;
                    var eSave = group.est;
                    var eFirstSave = group.estFirst;
                    var rowidSave = group.rowid;
                    var dateDueSave = group.dateDue;
                    var countCardsSave = group.countCards;
                    group = cloneObject(row); //re-clone so rows with s/e always take precedence over card-only rows.
                    group.spent = sSave;
                    group.est = eSave;
                    group.estFirst = eFirstSave;
                    group.rowid = rowidSave;
                    group.dateDue = dateDueSave;
                    group.countCards = countCardsSave;
                }
                group.spent += row.spent;
                group.est += row.est;
                group.estFirst += row.estFirst;

                if (row.rowid !== undefined && row.rowid != -1 && (group.rowid === undefined || row.rowid > group.rowid)) {
                    group.rowid = row.rowid; //maintanin rowid so that a "mark all read" on a grouped report will still find the largest rowid
                }
            }
            map[key] = group;
            if (bCountCards) {
                if (!mapCardsPerGroup[key]) {
                    group.countCards = 0;
                    mapCardsPerGroup[key] = {};
                }
                if (!mapCardsPerGroup[key][row.idCardH]) {
                    mapCardsPerGroup[key][row.idCardH] = true;
                    group.countCards++;
                }
            }
        }


        for (i in map) {
            ret.push(map[i]);
        }
    } else {
        ret = cloneObject(rowsOrig); //so sorting doesnt mess with rowsOrig
    }

    //sort
    //note: propDateString might not be in rows at this point (is here only if there was grouping)
    if (ret.length > 0 && propertySort.length > 0 && (propertySort != "date" || propertyGroup.length > 0)) {
        var bString = typeof (ret[0][propertySort]) == "string";
        var bRemain = (propertySort == "remain");
        var bPosList = (propertySort == "posList");
        ret.sort(function doSort(a, b) {
            if (bPosList) {
                var namePropBoard = "nameBoard";
                var ret = a[namePropBoard].localeCompare(b[namePropBoard]);
                if (ret != 0)
                    return ret;
                return a[propertySort] - b[propertySort];
            }
            if (bString)
                return (a[propertySort].localeCompare(b[propertySort]));
            var va = null;
            var vb = null;

            if (bRemain) {
                va = a.est - a.spent;
                vb = b.est - b.spent;
            } else {
                if (propertySort == "dateDue") { //REVIEW ZIG: ugly duplication in setReportData
                    va = b[propertySort];
                    vb = a[propertySort];
                }
                else {
                    va = a[propertySort];
                    vb = b[propertySort];
                }

            }
            return (vb - va);
        });
    }
    return ret;
}

function getHtmlDrillDownTooltip(rows, mapCardsToLabels, headersSpecial, options, groupBy, orderBy, eType, archived, deleted, bShowMonth, bByROpt) {
    var bOrderR = (orderBy == "remain");
    var header = [];
    var bCountCards = options.bCountCards;
    var bNoTruncate = options.bNoTruncate;
    function pushSpecialLinkHeader() {
        assert(header.length > 0);
        headersSpecial[header.length - 1] = {
            sorter: 'links'
        };
    }
    //review zig exclude columns https://docs.google.com/spreadsheets/d/1mcDza4o4CG3xlQns_iL5zsrGb1a_EumL8Bn-5We77X0/edit#gid=0

    var strAppendHeaders = (groupBy == "" ? "" : g_postFixHeaderLast);
    var bGroupedByDate = (groupBy.indexOf("date") >= 0);
    var bShowKeyword = g_bShowKeywordFilter;
    if (bShowKeyword)
        header.push({ name: "Keyword" + strAppendHeaders });

    var bRPopup = (bOrderR && g_bPopupMode);
    var bShowDate = (!bRPopup || bGroupedByDate);
    if (bShowDate)
        header.push({ name: "Date" + (bGroupedByDate ? "" : strAppendHeaders) });

    var bCardGrouping = (groupBy.toLowerCase().indexOf("card") >= 0);
    var bShowBoard = (groupBy == "" || groupBy.indexOf("idBoardH") >= 0 || groupBy.indexOf("idCardH") >= 0);
    var bShowCard = (groupBy == "" || groupBy.indexOf("idCardH") >= 0);
    var bShowTeam = (groupBy.indexOf("idTeamH") >= 0 || (!g_bPopupMode && bShowBoard));
    var bShowLabels = bShowCard && g_bShowLabelsFilter;
    var bShowList = ((!bRPopup || groupBy.indexOf("nameList") >= 0) && g_bEnableTrelloSync && (groupBy == "" || groupBy.indexOf("nameList") >= 0 || orderBy.indexOf("posList") >= 0 || bShowCard));
    var bPushedCard = false;
    var bShowHashtag = (groupBy.indexOf("hashtagFirst") >= 0);
    function pushCardHeader() {
        if (options.bOutputCardShortLink)
            header.push({ name: "Card shortLink" });

        if (options.bOutputCardIdShort)
            header.push({ name: "Card #" });
        header.push({ name: "Card" });
        pushSpecialLinkHeader();
    }

    if (bCardGrouping)
        header.push({ name: "Due date" }); //without strAppendHeaders

    var bShowWeek = (bShowDate && (bGroupedByDate || !g_bPopupMode));
    if (bShowWeek)
        header.push({ name: "Week" + strAppendHeaders });

    if (bShowCard && bCardGrouping && !bPushedCard) {
        pushCardHeader();
        bPushedCard = true;
    }

    if (bCountCards)
        header.push({ name: "Card count"});
    var bGroupByCardOrNone = (groupBy == "" || bCardGrouping);
    var bShowArchived = (g_bEnableTrelloSync && bGroupByCardOrNone && archived != "1" && archived != "0");
    var bShowDeleted = (g_bEnableTrelloSync && bGroupByCardOrNone && deleted != "1" && deleted != "0");
    if (bShowMonth)
        header.push({ name: "Month" + strAppendHeaders });
    var bShowUser = (groupBy == "" || groupBy.toLowerCase().indexOf("user") >= 0);
    if (bShowUser)
        header.push({ name: "User" });

    if (bShowTeam) {
        header.push({ name: "Team" });
        pushSpecialLinkHeader();
    }

    if (bShowBoard) {
        if (options.bOutputBoardShortLink)
            header.push({ name: "Board shortLink" });
        header.push({ name: "Board" });
        pushSpecialLinkHeader();
    }

    if (bShowList)
        header.push({ name: "List" });

    if (bShowHashtag) {
        header.push({ name: "Hashtag" });
    }

    if (bShowCard && !bPushedCard) {
        pushCardHeader();
        bPushedCard = true;
    }

    if (bShowLabels)
        header.push({ name: "Labels" });

    var bShowSE = true;

    if (bOrderR && groupBy != "idCardH-user" && bByROpt)
        bShowSE = false; //S/E is not meaningful when filtering only by cards with non-zero R

    if (bShowSE) {
        header.push({ name: "S" });
        header.push({ name: "E 1ˢᵗ" });
        header.push({ name: "E" });
    }
    bShowRemain = (bOrderR || groupBy != "");
    if (bShowRemain)
        header.push({ name: "R" });

    var bShowComment = (groupBy == "");
    if (bShowComment)
        header.push({ name: "Note", bExtend: true });

    var bShowEtype = (groupBy == "");

    if (bShowEtype)
        header.push({ name: COLUMNNAME_ETYPE });

    if (bShowArchived)
        header.push({ name: "Archived" });

    if (bShowDeleted)
        header.push({ name: "Deleted" });

    var dateNowCache = new Date();
    function callbackRowData(row) {
        bPushedCard = false;
        if (row.rowid && row.rowid > g_rowidLastSyncRemember) //review zig: hacky way so we dont loop the array twice. would be nice if this was outside of view
            g_rowidLastSyncRemember = row.rowid;
        var rgRet = [];
        var dateString = row["dateString"];
        var dateTimeString = row["dtString"];
        var daterow = new Date(row.date * 1000); //db is in seconds
        if (dateString === undefined || dateTimeString === undefined) {
            var dateDbUse = daterow;
            dateString = makeDateCustomString(dateDbUse);
            dateTimeString = makeDateCustomString(dateDbUse, true);
        }
        if (bShowKeyword)
            rgRet.push({ name: escapeHtml(row.keyword), bNoTruncate: true });
        if (bShowDate)
            rgRet.push({ name: (bGroupedByDate ? dateString : dateTimeString), bNoTruncate: true });
        if (bCardGrouping) {
            var dateDueTimeString = row.dateDue || "";
            if (dateDueTimeString) {
                dateDueTimeString = new Date(dateDueTimeString * 1000);
                dateDueTimeString = makeDateCustomString(dateDueTimeString, true);
            }
            rgRet.push({ name: dateDueTimeString, bNoTruncate: true });
        }

        function pushCardRow() {
            if (options.bOutputCardShortLink) {
                rgRet.push({ name: row.idCardH, bNoTruncate: true });
            }
            if (options.bOutputCardIdShort) {
                rgRet.push({ name: row.idShort, bNoTruncate: true });
            }

            var urlCard;
            if (row.idCardH.indexOf("https://") == 0)
                urlCard = row.idCardH; //old-style card URLs. Could be on old historical data from a previous Spent version
            else
                urlCard = "https://trello.com/c/" + row.idCardH;

            rgRet.push({ name: "<A title='Go to Trello card' target='_blank' href='" + urlCard + "'>" + escapeHtml(bNoTruncate ? row.nameCard : strTruncate(row.nameCard)) + "</A>", bNoTruncate: true });
        }

        if (bShowWeek) //week
            rgRet.push({ name: row.week ? row.week : getCurrentWeekNum(daterow), bNoTruncate: true });

        if (bShowCard && bCardGrouping && !bPushedCard) { //card
            pushCardRow();
            bPushedCard = true;
        }

        if (bCountCards)
            rgRet.push({ name: String(row.countCards || 0), bNoTruncate: true });

        if (bShowMonth)
            rgRet.push({ name: row.month ? row.month : getCurrentMonthFormatted(daterow), bNoTruncate: true });
        if (bShowUser)
            rgRet.push({ name: row.user, bNoTruncate: bNoTruncate });

        if (bShowTeam) {
            var urlTeam = "https://trello.com/" + (row.nameTeamShort || "");
            var nameTeam = row.nameTeam || ""; //for rows without team
            rgRet.push({ name: "<A title='Go to Trello team' target='_blank' href='" + urlTeam + "'>" + escapeHtml(bNoTruncate ? nameTeam : strTruncate(nameTeam)) + "</A>", bNoTruncate: true });
        }

        if (bShowBoard) {
            if (options.bOutputBoardShortLink)
                rgRet.push({ name: (row.idBoardH == IDBOARD_UNKNOWN ? "" : row.idBoardH), bNoTruncate: true });
            var urlBoard = "https://trello.com/b/" + row.idBoardH;
            rgRet.push({ name: "<A title='Go to Trello board' target='_blank' href='" + urlBoard + "'>" + escapeHtml(bNoTruncate ? row.nameBoard : strTruncate(row.nameBoard)) + "</A>", bNoTruncate: true });
        }

        if (bShowList) {
            var strListUse = row.nameList;
            if (!bNoTruncate)
                strListUse = strTruncate(strListUse, g_cchTruncateShort);
            rgRet.push({ name: escapeHtml(strListUse), bNoTruncate: true });
        }


        if (bShowHashtag) {
            rgRet.push({ name: escapeHtml(row.hashtagFirst), bNoTruncate: bNoTruncate });
        }

        if (bShowCard && !bPushedCard) {
            pushCardRow();
            bPushedCard = true;
        }

        if (bShowLabels) {
            assert(mapCardsToLabels);
            var labels = (mapCardsToLabels[row.idCardH] || { labels: "" }).labels;
            rgRet.push({ name: labels, bNoTruncate: true }); //labels dont truncate otherwise it could not show an entire label if the card has many
        }
        var sPush = parseFixedFloat(row.spent);
        var estPush = parseFixedFloat(row.est);
        if (bShowSE) {
            rgRet.push({ type: "S", name: sPush, bNoTruncate: true });
            rgRet.push({ type: "EFirst", name: parseFixedFloat(row.estFirst), bNoTruncate: true }); //not type "E". that is used when showing sum of row selections
            rgRet.push({ type: "E", name: estPush, bNoTruncate: true });
        }
        if (bShowRemain) {
            var remainCalc = parseFixedFloat(row.est - row.spent);
            if (bOrderR && remainCalc == 0)
                return [];
            rgRet.push({ type: "R", name: remainCalc, bNoTruncate: true }); //type "R" just so it generates the transparent zero
        }
        if (bShowComment)
            rgRet.push({ name: escapeHtml(row.comment), bNoTruncate: bNoTruncate });

        if (bShowEtype)
            rgRet.push({ name: nameFromEType(row.eType), bNoTruncate: true });

        if (bShowArchived)
            rgRet.push({ name: row.bArchivedCB > 0 ? "Yes" : "No", bNoTruncate: true });

        if (bShowDeleted)
            rgRet.push({ name: row.bDeleted ? "Yes" : "No", bNoTruncate: true });

        if (!bShowComment) {
            var title = "Last: ";
            title += row.user;
            title += " - " + row.nameBoard;
            title += " - " + row.nameList;
            title += " - " + row.nameCard;
            title += " - " + row.comment;
            if (row.rowid == -1)
                title += "\n(no s/e)";
            rgRet.title = title;
        } else {
            rgRet.title = (bShowSE ? "(" + sPush + " / " + estPush + ") " : "") + row.comment;
        }
        if (row.date) {
            var dateRow = new Date(row.date * 1000);
            var delta = getDeltaDates(dateNowCache, dateRow); //db is in seconds
            var postFix = " days ago";
            if (delta == 1)
                postFix = " day ago";
            else if (delta == 0) {
                delta = "";
                postFix = "today";
            }
            rgRet.title = rgRet.title + "\n" + makeDateCustomString(dateRow, true) + "\n" + getCurrentWeekNum(dateRow) + " " + delta + postFix;
        }
        return rgRet;
    }

    return getHtmlBurndownTooltipFromRows(true, rows, false, header, callbackRowData, true, "", bShowSE);
}

function getSQLReport(sql, values, callback) {
    getSQLReportShared(sql, values, callback, function onError(status) {
        showError(status);
    });
}