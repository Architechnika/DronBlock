var MenuAligin = function()
{
    $(".topmenu li").each(function(){
        var $li = $(this);	
        var $sub = $($li.find(".submenu")[0]);
        var $btn = $($li.find("button")[0]);
        console.log($btn);
        $btn.on("mouseenter", function(){
            var max = 0;
            $sub.children().each(function(index){
                var $this = $(this);
                var btn = $($this.find("button")[0]);
                console.log("outer: " + btn.outerWidth());
                console.log("width: " + btn.width());
                var width = btn.width();
                if(width > max)
                    max = width;
            });
            
            //console.log("max is " + max);
            
            $sub.children().each(function(index){
                var $this = $(this);
                var btn = $($this.find("button")[0]);
                btn.width(max);
                //console.log(btn.width());
            });
            $btn.unbind();	
        });
    });

};