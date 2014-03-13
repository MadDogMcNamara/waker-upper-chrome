// The form to create a new alarm
{
  var collapsedHeight = 50;
  var collapsedWidth = 150;
  var expandedHeight = 300;
  var expandedWidth = 400;
  var formBorderWidth = 2;

  var newAlarmView;
  var newAlarmForm;
  var openFormButton;
  var hourInput;
  var minuteInput;
  var ampmInput;

  var hourText = "";
  var minuteText = "";
  var ampmText = "";

  var cancelButton;
  var confirmButton;

  function collapseForm(time){
    time = time || 400;
    newAlarmView.animate( {width:collapsedWidth + "px", height:collapsedHeight + "px"}, time, 'swing', function() {
      newAlarmView[0].style.borderWidth = "0" + "px";
      // show button
      openFormButton[0].style.display = 'block';
      // hide form
      newAlarmForm[0].style.display = 'none';
    } );

  }

  function expandForm(time){
    time = time || 400;
    newAlarmView[0].style.borderWidth = formBorderWidth + "px";
    newAlarmView.animate( {width:expandedWidth + "px", height:expandedHeight + "px"}, time );

    // set inputs to defaults
    hourInput[0].value = "08";
    minuteInput[0].value = "00";
    ampmInput[0].value = "AM";

    // focus on hour
    hourInput.click();
    hourInput[0].click();

    // hide button
    openFormButton[0].style.display = 'none';
    // show form
    newAlarmForm[0].style.display = 'block';
  }

  window.addEventListener( "load", function(){
    newAlarmView = $("div.newAlarmView");
    openFormButton = newAlarmView.find("> button");
    newAlarmForm = newAlarmView.find("div.newAlarmForm");
    hourInput = newAlarmView.find("input.hourInput");
    minuteInput = newAlarmView.find("input.minuteInput");
    ampmInput = newAlarmView.find("input.ampmInput");

    cancelButton = newAlarmView.find("button.cancelNewAlarm");
    confirmButton = newAlarmView.find("button.confirmNewAlarm");

    function onClick(){
      this.setSelectionRange(0, 0);
      this.setSelectionRange(0, this.value.length);

      if ( this === hourInput[0] ){
        hourText = "";
      }
      else if ( this === minuteInput[0] ){
        minuteText = "";
      }
    }

    function onKeyHour( event ){
      //tab
      if ( event.keyCode === 9 ) return;

      var thisKey = String.fromCharCode(event.keyCode);
      var newText = hourText;

      if ( !(/^[0-9]$/).test( thisKey ) ){
        thisKey = "" + event.keyCode - 96;
      }


      if ( (/^[0-9]$/).test( thisKey ) && parseInt(thisKey, 10) < 10 ){
        newText = newText + thisKey;
        var num = parseInt( newText, 10 );
        if ( newText.length == 1 ){
          if ( num < 2 ){
            hourText = newText;
          }
          else{
            hourText = "0" + newText;
          }
        }
        else if ( newText.length == 2 ){
          if ( num <= 12 ){
            hourText = newText;
          }
        }
      }


      this.value = hourText;

      if ( this.value.length >= 2 ){
        minuteInput.click();
      }
    }
    function onKeyMinute( event ){
      //tab
      if ( event.keyCode === 9 ) return;

      var thisKey = String.fromCharCode(event.keyCode);
      var newText = minuteText;
      if ( !(/^[0-9]$/).test( thisKey ) ){
        thisKey = "" + event.keyCode - 96;
      }


      if ( (/^[0-9]$/).test( thisKey ) && parseInt(thisKey, 10) < 10 ){
        newText = newText + thisKey;
        var num = parseInt( newText, 10 );
        if ( newText.length == 1 ){
          if ( num < 6 ){
            minuteText = newText;
          }
          else{
            minuteText = "0" + newText;
          }
        }
        else if ( newText.length == 2 ){
          if ( num <= 60 ){
            minuteText = newText;
          }
        }
      }

      this.value = minuteText;
      if ( this.value.length >= 2 ){
        ampmInput.click();
      }
    }

    function onKeyAMPM(){
      var thisKey = String.fromCharCode(event.keyCode);
      if ( thisKey === 'A' ){
        ampmText = "AM";
      }
      else if ( thisKey === 'P' ){
        ampmText = "PM";
      }
      else if ( thisKey === 'M' ){
      }
      else {
        ampmText = ( ampmText === "AM" ) ? "PM" : "AM";
      }

      this.value = ampmText;
    }
    hourInput.click( onClick );
    hourInput.focus( onClick );
    minuteInput.click( onClick );
    minuteInput.focus( onClick );
    ampmInput.click( onClick );

    hourInput.keyup( onKeyHour );
    minuteInput.keyup( onKeyMinute );
    ampmInput.keyup( onKeyAMPM );

    cancelButton.click( function(){
      collapseForm();
    });

    confirmButton.click( function(){
      var hour = hourInput[0].value;
      var minute = minuteInput[0].value;
      var ampm = ampmInput[0].value;

      var time = alarmView.getDateFromText( hour + ":" + minute + ampm );
      alarmView.setAlarm( time.getTime() );
      collapseForm();
    });

    // event listener for new alarm button
    openFormButton.click(expandForm);

    collapseForm(1);
  });
}
