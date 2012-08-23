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
            _status = "off";
            $( _this ).stop( true, false );
        }      
        this.initialize = function() 
        {
            return this;
        };
        
        //PRIVATE
        //------------------------------------------------------------------------------
        
        var loop = function()
        {
            $(_this).css("background-position-x", "0");
            animateBar();
        }
        var animateBar = function()
        {
            $( _this ).animate(
                {"background-position-x": '-=9'},
                _speed,
                "linear",
                function(){ if ( _status == "on" ) { loop() }; } 
            );
        }
        
        return this.initialize();

    };
    
}
)(jQuery);