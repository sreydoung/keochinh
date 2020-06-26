var HomeManager = (function(){
	function getNew(rss_link) {
		$.getJSON( "https://api.rss2json.com/v1/api.json?rss_url=" + rss_link, function( data ) {
			var html = "";
			var len = 47;
			$.each(data['items'], function(index, value){
				if(index >= 10) return true;
				var title = value['title'];
				if(title.length > len){
					title = title.substr(0,len);
					if(title.slice(-1) != " "){
						var x = title.split(" ");
						var lastWord = x[x.length-1];
						title = title.substr(0, len - lastWord.length);
					}

					title += "...";
				}
				html += "<li>"+
						    "<article class='entry-item clearfix'>"+
						        "<span class='entry-thumb'>"+(parseInt(index)+1)+"</span>"+
						        "<div class='entry-content'>"+
						            "<h4 class='entry-title'><a target='_blank' href='"+ value['link'] +"'>"+ title +"</a></h4>"+
						            "<span class='entry-date'>"+ value['pubDate'] +"</span>"+
						        "</div>"+
						    "</article>"+
						"</li>";
			});

			$(".widget-area-3.sidebar .tab-container-1 ul").html(html);
		});
	}
	function warning() {
		$(".error").unbind("click");
		$(".error").click(function(){

			//build name
			var name = $(this).parent().find("a").html();

			$("#myModal").find("input[name=suggest]").val("");
			$("#myModal").find("label[name=name]").html("Tên nhóm: " + name);

			//build link
			var links = $(this).parent().parent().find("span a");

			if(links.length == 0) links = $(this).parent().find("a");

			var html_link = "";
			for (var i = 0; i < links.length; i++) {
				var link = links[i];
				var url = $(link).attr('href');
				var id = $(link).attr('lid');
				html_link += "<option value="+ id +">"+ url +"</option>";
			}

			$("#myModal .form-group.links select[name=link]").html(html_link);

			$("#myModal").modal();

			$("#myModal").find(".send").unbind("click");
			$("#myModal").find(".send").click(function(){
				var id = $("#myModal select[name=link] option:selected").val();
				var reason = $("#myModal select[name=reason] option:selected").val();
				var suggest = $("#myModal input[name=suggest]").val();

				$.ajax({
					type: "POST",
					dataType: 'json',
					url: "/warning",
					data: { id: id, reason: reason, suggest: suggest}
				}).done(function( msg ) {
					alert( "Cảm ơn đóng góp của bạn !");
				});
			});
		});
	}
	function getAllLinks(){
		$.ajax({ 
			type: "POST",
		    dataType: 'json',
		    url: "/get-all-links"
		}).done(function( response ){
			var html = "";
			$.each(response, function(game, value ) {
				$.each(value, function(type, v){
					var isAg = type == 'ag' ? "" : 'web-player';
					var titleGame = type == "ag" ? "<span class='title-text'>"+ game +"<span class='triangle-right'></span><span class='triangle-left'></span><span class='triangle-bottom'></span></span>":
													"";
					var titleTab = type == 'ag' ? "Trang quản trị" : "Trang thành viên";

					var prifixProvider = type == 'ag' ? "Ag." : "";

					html += "<div class='widget-area-1 "+ isAg +"'> "+
		                        "<div class='widget home-slider-widget'>"+
		                            "<h3 class='widget-title clearfix'>"+
		                                titleGame + 
		                                "<span class='title-right'>" + titleTab + "</span>"+
		                            "</h3>"+
		                            "<ul class='older-post'>";

		            var count = 0;
					$.each(v, function(provider, info_links){

						var isFirst = count == 0 ? 'first' : '';
						count++;

						var classProvider = provider.toLowerCase();
						classProvider = classProvider.replace("(", "");
						classProvider = classProvider.replace(")", "");

						html += "<li class='"+ isFirst +"'>"+
                                    "<article class='entry-item clearfix'>"+
                                        "<div class='entry-content'>"+
                                            "<h4 class='entry-title'>"+
                                                "<a target='_blank' href='"+ info_links[0]['url'] +"' lid='"+info_links[0]['id']+"'>"+prifixProvider+ provider+"</a>"+
                                                "<img class='logo-provider "+classProvider+"' src='/img/logo/"+provider+".jpg' onerror=\"this.style.display='none'\">" + 
                                                // "<span class='error'></span>"+
                                            "</h4>";
                        if(info_links.length > 1){
                        	$.each(info_links, function(i, info){
	                        	html += "<span class='entry-date'><a target='_blank' href='"+info["url"]+"' lid='"+info['id']+"'>"+info["device"]+ "</a></span>";
	                        });
                        }

						html += "</div></article></li>";
					});

					html += "</ul></div></div>";
				});
			});
			$("#main-col").html(html);
			$(".wrapper-all").removeClass('hidden');
			// loading_screen.finish();
			// warning();
		});
	}
	return{
		init: function(){
			// var loading_screen = pleaseWait({
			// 	logo: "/img/logo.png",
			// 	backgroundColor: '#D93B3B',
			// 	loadingHtml: "<div class='sk-cube-grid'><div class='sk-cube sk-cube1'></div><div class='sk-cube sk-cube2'></div><div class='sk-cube sk-cube3'></div><div class='sk-cube sk-cube4'></div><div class='sk-cube sk-cube5'></div><div class='sk-cube sk-cube6'></div><div class='sk-cube sk-cube7'></div><div class='sk-cube sk-cube8'></div><div class='sk-cube sk-cube9'></div></div>"
			// });
			// getAllLinks();
			getNew("http://bongda24h.vn/RSS/172.rss");
		}
	}
})();

var TypeRequet = function(){  
    return{
        New : 0, 
        All : 1,
    }
}();
