/*******************************************************************************
 * Copyright (c) 2018 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *******************************************************************************/
var mobileWidth = 767;

function addTOCClick() {
    var onclick = function (event) {
        var resource = $(event.currentTarget);
        setSelectedTOC(resource);
        var currentHref = resource.attr("href");

        // handle the click event ourselves so as to take care of updating the hash and creating
        // the push state 
        event.preventDefault();
        event.stopPropagation();

        /*
        if (isMobileView()) {
            $("#breadcrumb_hamburger").show();
            $("#breadcrumb_hamburger").trigger("click");
            $("#feature_content").show();
        }
        */

        loadContent(currentHref);
        updateMainBreadcrumb(resource);
        updateHashInUrl(currentHref);
    }

    $("#toc_container > ul > li > div").off("click").on("click", onclick);
}

function setSelectedTOC(resource) {
    var currentTOCSelected = $(".toc_selected");
    var newHref = resource.attr("href");

    if (currentTOCSelected.length === 1) {      
        currentTOCSelected.removeClass("toc_selected");
    }
    resource.parent().addClass("toc_selected");
}

function loadContent(href) {
    $("#feature_content").load(href, function(response, status) {
        if (status === "success") {
            addClassToFeaturesThatEnableThisFeature();
            setContainerHeight();
        }
    });
}

function updateMainBreadcrumb(resource, notRemove) {
    if (notRemove === undefined || notRemove === false) {
        var lastBreadcrumb = $(".breadcrumb.fluid-container").find("li:last-child");
        var lastBreadcrumbAnchorTag = lastBreadcrumb.find("a");
        if (lastBreadcrumbAnchorTag.hasClass("inactive_link")) {
            // remove existing inactive link
            lastBreadcrumb.remove();
        }
    }

    if (resource !== undefined) {
        $(".breadcrumb.fluid-container").append("<li><a class='inactive_link'>" + resource.text() + "</a></li>");
    }
}

function updateHashInUrl(href) {
    if (!isMobileView()) {
        var hashInUrl = href;
        if (href.indexOf("/feature/") !== -1) {
            hashInUrl = href.substring(9);
        }
        //var state = { href: href }
        window.history.pushState(null, null, '#' + hashInUrl);
    }
}

function isMobileView() {
    if ($(window).width() <= mobileWidth) {
        return true;
    } else {
        return false;
    }
}

function addClassToFeaturesThatEnableThisFeature() {
    var featuresThatEnableThisFeature = $("#features-that-enable-this-feature");
    if (featuresThatEnableThisFeature.length === 1) {
        var ulist = featuresThatEnableThisFeature.parent().find('.ulist');
        if (ulist.length === 1) {
            ulist.addClass('enableByList');
        }
    }
}

function setContainerHeight() {
    //var containerHeight = $("#toc_column").outerHeight();
    var featureContentHeight = $("#feature_content").outerHeight() + "px";
    $("#background_container").css("height", featureContentHeight);
    $("#background_container").css("margin-bottom", "60px");
    $("#toc_column").css("height", featureContentHeight);
}

function selectFirstDoc() {
    if (!isMobileView()) {
        var firstTOCElement = $("#toc_container > ul > li > div").first();
        loadContent(firstTOCElement.attr("href"));
        setSelectedTOC(firstTOCElement);  
        updateMainBreadcrumb();
    }

}

$(document).ready(function () {  
    addTOCClick();

    //attaching the event listener
    $(window).on('hashchange', function () {
        if (window.location.hash) {
            var tocHref = "/feature/" + window.location.hash.substring(1);
            var tocElement = $("#toc_container").find("div[href='" + tocHref + "']");
            if (tocElement.length === 1) {
                loadContent(tocHref);
                setSelectedTOC(tocElement);
                updateMainBreadcrumb(tocElement);
            }
        } else {
            selectFirstDoc();
        }

    });

    //manually tiggering it if we have hash part in URL
    if (window.location.hash) {
        $(window).trigger('hashchange')
    } else {
        selectFirstDoc();
    }
})