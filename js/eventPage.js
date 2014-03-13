
{
  var alarmsData = [];

  var openAlarmTab;

  function gotoMainPage(f) {
    if ( !openAlarmTab ){
      function listener (tabId, changeInfo, tab) {
        if ( changeInfo.status && changeInfo.status === "complete" ){
          f && f();
          chrome.tabs.onUpdated.removeListener(listener);
        }
      }
      chrome.tabs.create({url:"mainPage.html"}, function(tab){ openAlarmTab = tab;});
      chrome.tabs.onUpdated.addListener( listener );
    }
    else
    {
      chrome.tabs.update( openAlarmTab.id, {active: true} );
      chrome.windows.update( openAlarmTab.windowId, {focused:true} );
      f && f();
    }

  }

  function loadAlarmData( f ){
    chrome.storage.sync.get( ["alarmsData"], function( data ) {
      alarmsData = data.alarmsData || [];
      alarmsDataChanged();
      f();
    });
  }

  function saveChanges(f){
    chrome.storage.sync.set( { "alarmsData": alarmsData }, function( ) {
      f();
    });
  }


  function alarmsDataChanged(){
    // send to main page if open
    //todo

    chrome.alarms.clearAll();
    //make sure timers reflect the data
    for ( var i = 0; i < alarmsData.length; i++ ){
      var alarmData = alarmsData[i];

      if ( !alarmData.repeating ){
        chrome.alarms.create( alarmData.id, { when: alarmData.alarmTime } );
      }
    }
    saveChanges( function() {} );

    // notify page
    if ( openAlarmTab ){
      chrome.tabs.sendMessage(openAlarmTab.id, {name:"alarmsDataChanged", "alarmsData": alarmsData}, function() {});
    }
  }

  chrome.alarms.onAlarm.addListener(function (alarm){
    var alarmIndex = -1
    for ( var i = 0; i < alarmsData.length; i++ ){
      if ( alarmsData[i].id === alarm.name ){
        alarmIndex = i;
        break;
      }
    }
    if ( alarmIndex != -1 ){
      var alarmData = alarmsData[alarmIndex];
      alarmsData.splice( alarmIndex, 1 );
      gotoMainPage(function() {
        chrome.tabs.sendMessage(openAlarmTab.id, {name:"alarmOff", "alarmData": alarmData}, function() {});
      });
      alarmsDataChanged();
    }
  })

  // create main page when icon is clicked
  chrome.browserAction.onClicked.addListener(function(tab) {
    gotoMainPage();
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if ( request.name === "newAlarm" ){
        request.alarmData && request.alarmData.alarmTime && !isNaN(request.alarmData.alarmTime) && alarmsData.push( request.alarmData );
      }
      else if ( request.name && request.name === "deleteAlarm" && alarmsData ){
        var dataToDelete = request.alarmData;
        for ( var i = 0; alarmsData.length && i < alarmsData.length; i++ ){
          if ( alarmsData[i].id === dataToDelete.id ){
            alarmsData.splice( i, 1 );
          }
        }
      }

      saveChanges(function(){});
      alarmsDataChanged();
    });


    chrome.tabs.onUpdated.addListener( function(tabId, changeInfo, tab) {
      if ( openAlarmTab && tabId === openAlarmTab.id && changeInfo.status && changeInfo.status === "complete" ){
        alarmsDataChanged();
      }
    });

    chrome.tabs.onRemoved.addListener( function(tabId, removeInfo) {
      if ( openAlarmTab && tabId === openAlarmTab.id ){
        openAlarmTab = null;
      }
    });

  loadAlarmData(function(){});


}
