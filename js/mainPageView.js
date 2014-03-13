// a view for the overall structure of the mainPage



window.addEventListener( "load", function onLoad() {
  var roots = $("span.iconRoot");
  var tabs = ["alarmTab", "helpTab"];
  var selectedIcon = null;

  var mouseEnter = function(a){
    return function(){
      if ( selectedIcon !== this ){
        a.stop().animate( { height: "165px" }, 200, 'easeOutBounce', function () { } );
      }
    };
  };
  var mouseExit = function(a){
    return function(){
      a.stop().animate( { height: "0px" }, 200, 'easeOutBounce', function () { } );
    };
  };

  var mouseClick = function(){
    return function() {
      if ( selectedIcon === this ) return;

      // set all tab selectors to proper color
      var icons = $("div.iconBackgroundBackground");
      icons.stop();
      for ( var i = 0; i < icons.length; i++ ){
        var icon = icons[i];
        icon.style.backgroundColor = 'grey';
      }

      selectedIcon = this;

      var root = jQuery( this.parentNode.parentNode );

      var back = root.find("span.iconBackground");
      var backBack = root.find("div.iconBackgroundBackground");

      back.stop()[0].style.height = "0px";
      backBack.animate( {backgroundColor: 'blue' });
      backBack[0].style.backgroundColor = "blue";

      for ( var i = 0; i < tabs.length; i++ ){
        var tabElement = $("div." + tabs[i])[0];

        // points to tab linked to this button
        var tabData = jQuery(this).attr("data-tab");
        tabData = JSON.parse( tabData );

        if ( tabData.controlledTab === tabs[i] ){
          tabElement.style.display = "inline";
        }
        else{
          tabElement.style.display = "none";
        }
      }
    };

  }


  for ( var i = 0; i < roots.length; i++ ){
    var root =  jQuery(roots[i]);
    var x = root.find("button.iconCover");
    var y = root.find("span.iconBackground");
    var h = getStyle( y[0], "height" );

    x.click( mouseClick() );
    x.mouseenter( mouseEnter(y) );
    x.mouseout( mouseExit( y ) );

    // alarm icon is default selected
    if ( x.hasClass( "alarmIconCover") ){
      x.click();
    }

  }




});
