// The entire alarm tab and video at bottom

var alarmView = {};

(function (parent){

  function injectYoutubeVideo( videoId ){
    var finalUrl = "http://www.youtube.com/embed/" + videoId + "?enablejsapi=1";
    injectVideo( finalUrl );
  }

  function injectVideo( url ){
    // remove any existing video
    $("iframe.alarmVideo").remove()

    // add to end of videoID div
    var videoDiv = $("#videoID");

    videoDiv.append( '<iframe class="alarmVideo" type="text/html" src="' + url + '"></iframe>' );
  }

  function injectAlarmInstance( alarmData ){

    var dateObj = new Date( alarmData.alarmTime );
    var hour = dateObj.getHours();
    hour = ((hour < 10) ? "0" : "" ) + hour;
    var ampm = "am";
    if ( hour >= 12 ){
      ampm = "pm"
    }
    if ( hour > 12 ){
      hour -= 12;
    }

    var minute = dateObj.getMinutes();
    minute = ((minute < 10) ? "0" : "") + minute;
    var timeString = hour + ":" + minute + " " + ampm;

    var injectCode = '<span class="alarmInstanceRoot" >' +
                     '<p class="digitalFont alarmPreviewText">' +
                     timeString +
                     '</p><button type="button" class="iconCover deleteIcon" ></button></span>'


    var holder = $("#alarmInstanceHolder");
    if ( holder ){
      var newAlarm = jQuery( holder.append(injectCode).children().last() );
      var trashButton = jQuery( newAlarm.children()[1] );

      // add to idmap so it may be retrieved later
      alarmIdToData[trashButton[0].id] = alarmData;

      // remove on click
      trashButton.click(function() {
        chrome.runtime.sendMessage({
          name : "deleteAlarm",
          "alarmData": alarmData
        },function( response ) {} );
        newAlarm.remove();
      });

    }
  }


  function fireAlarm (alarmData){
    //ensure player exists
    // todo

    // play player
    callPlayer('videoID', function() { callPlayer('videoID', 'playVideo'); });
  }


  function setAlarm( time ){
    var data = { repeating: false, id: Math.random().toString(), alarmTime: time };

    chrome.runtime.sendMessage({
      name : "newAlarm",
      alarmData: data
    },function( response ) {} );
  }

  parent.setAlarm = setAlarm;


  function getDateFromText( alarmText ){
    var pattern = /^([0-9]{1,2}):([0-9]{1,2})\s*(am|pm)$/i;

    var matchResult = pattern.exec(alarmText);
    if ( matchResult ){
      var hour = matchResult[1];
      var minute = matchResult[2];
      var ampm = matchResult[3];

      hour = parseInt( hour, 10 ) % 12;
      minute = parseInt( minute, 10 );
      if ( (/pm/i).test( ampm ) ) {
        hour += 12;
      }

      var nowTime = new Date();
      var alarmSet = new Date( nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate(), hour, minute, 0, 0 );
      if ( alarmSet < nowTime ){
        alarmSet = new Date( alarmSet.getTime() + 1000 * 60 * 60 * 24 );
      }
      return alarmSet;
    }
  }
  parent.getDateFromText = getDateFromText;

  function onAlarmsDataChanged( alarmsData ){
    // destroy all alarm instances
    var holder = $("#alarmInstanceHolder");
    holder.children().remove();

    // destroy html map
    alarmIdToData = {};

    for ( var i = 0; i < alarmsData.length; i++ ){
      var alarmData = alarmsData[i];
      injectAlarmInstance( alarmData );
    }
  }


  window.addEventListener( "load", function(){

    // set video url
    var videoElement = $("iframe.alarmVideo");
    var videoSet = $("button.setVideo");
    var videoText = $("input.videoInput");

    videoSet.click(function() {
      var videoUrl = videoText[0].value;
      var pattern = /^(?:http:)?\/{0,2}(?:www\.)?youtube\.com\/(?:watch)?\??(?:v=)([A-Za-z0-9_\-]*)/;
      var result = pattern.exec(videoUrl);
      if ( result ){
        // save to storage
        chrome.storage.sync.set( {"alarmVideoID": result[1]}, function(){} );

        injectYoutubeVideo(  result[1] );
      }
    });

    // get and inject the video
    chrome.storage.sync.get( "alarmVideoID", function(items) {
      if ( items && items.alarmVideoID ){
        injectYoutubeVideo( items.alarmVideoID );
      }
    });
  });


  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.name && request.name === "alarmOff" ){
        fireAlarm( request.alarmData );
      }
      else if ( request.name && request.name === "alarmsDataChanged" ){
        onAlarmsDataChanged( request.alarmsData );
      }
    }
  );

})(alarmView);
