//Progressbar animation / jQuery plugin
//2012, Lorenzo Buosi @EnglishTown Japan.

(function($)
{
    $.fn.pb = function( options ) 
    {
        //private stuff.
        var _status = "on";
        var _speed  = options.speed;
        
        //fix dumb scope issue
        var _this   = this;
        
        //PUBLIC
        //------------------------------------------------------------------------------
        this.loopAnimation = function()
        {
            _status = "on";
            
            loop();
        }
        this.killAnimation = function()
        {
            //$( $( this ).children(0).children(0) ).css("left", "20px");
            _status = "off";
            $( $( this ).children(0).children(0) ).stop( true, false )
        }      
        this.initialize = function() 
        {
            return this;
        };
        
        //PRIVATE
        //------------------------------------------------------------------------------
        
        var loop = function()
        {
            $( _this ).children(0).children(0).css("left","0");
            animateBar();
        }
        var animateBar = function()
        {
            //alert( $( _this ).children(0).children(0).attr( 'class' ) );
            $( _this ).children(0).children(0).animate(
                { left: '-=9' },
                _speed,
                "linear",
                function(){ if ( _status == "on" ) { loop() }; } 
            );
        }
        
        return this.initialize();

    };
    
}
)(jQuery);