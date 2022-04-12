$(function(){
    $("input").on("click",function(){
    var numberOfListItem = $("li").length;
    var randomChildNumber = Math.floor(Math.random()*numberOfListItem);
    $("h1").text($("li").eq(randomChildNumber).text());
    var imaage = ['https://storage.googleapis.com/www-cw-com-tw/article/202101/article-5ff76e12dff12.jpg',
    'https://tokyo-kitchen.icook.network/uploads/recipe/cover/156685/96a7420fa7879c00.jpg',
    'https://cdn1.cybassets.com/media/W1siZiIsIjk2MTgvcHJvZHVjdHMvMzM3MTQ1NjcvMTYyNjE3MTcwMl82MmFjNzYyNDM1NzQ2ZDNiYTljYy5qcGVnIl0sWyJwIiwidGh1bWIiLCI2MDB4NjAwIl1d.jpeg?sha=8ffcab009f316250'];
    var iii = document.getElementById("output");
    iii.innerHTML = '<img src="'+imaage[randomChildNumber]+'">';
    });
});