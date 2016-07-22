    
    //connect to the Mongo database

    var socket = io.connect('http://sociamvm-app-001.ecs.soton.ac.uk:9001');
    //call this when the page loads 

    var filter = false;
    var active_users = 0;
    var current_filter_keyword = "";
    var current_filter_lang = "";


    //THINGS TO DO WHEN THE APPLICATION IS FIRST OPENED

    //check for active filters
    socket.emit("filter","");
    socket.emit("get_filter_list","");


    //-------------------------------------------------------------

    //THINGS TO DO WITH THE SOCKET

    socket.on('callback', function(data) {
    console.log(data.done);
      // Print the data.data somewhere...
    });

    socket.on('existing_filters', function (data) {
      for(d in data){
         updateNewList(data[d]);
     }
      //sent a signal to the server to let them know you're here!
    });



    socket.on('processed_msg_cnt', function(data) {
      $("#processedMessages span").html(data);
      // Print the data.data somewhere...
    });


    socket.on('user_heartbeat', function (data) {
         socket.emit("active_user","");
      //sent a signal to the server to let them know you're here!
    });

    socket.on('filter', function (data) {
       filter = data;
      //sent a signal to the server to let them know you're here!
    });

    socket.on('new_filter_item', function (data) {
       updateNewList(data);
      //sent a signal to the server to let them know you're here!
    });



    //Check for an filtering going on for the keyword
    socket.on('set_filter_keyword', function (data) {
      console.log(data)
      current_filter_keyword = data;
      $("#currentFilter span").html(current_filter_keyword);
    });

       //Check for an filtering going on for the keyword
    socket.on('set_filter_lang', function (data) {
      console.log(data)
      current_filter_lang = data;
      $("#currentLangFilter span").html(current_filter_lang);
    });


    socket.on('active_user_count', function (data) {

      active_users = data;
      $("#activeUsers span").html(active_users);

      //sent a signal to the server to let them know you're here!
    });

    
    //for interval updating
   function loadLatestData(){
    socket.emit("load_cache","");
  }

     socket.on('historic_data', function (data) {
       console.log("Historic Data found");
      console.log(data);
      var count = data.length;
      var responses=""
         $("#responses span").html(count);
         for(var i=data.length-1; i>(data.length-4); i--){
          responses = responses + "<br>" + data[i].date + "<br>"+ data[i].message + "<br>";
         }
            $("#latestContributions span").html(responses);
    });




     //-----------------------------------------------------------------
     //THINGS TO DO WITH THE INTERFACE!


    $('#submit_keyword').on('click', function(event) {
      event.preventDefault();

      dta = $("input#filter_keyword").val();
      if(dta.length > 0){
      socket.emit('filter_keyword', $("input#filter_keyword").val());
        console.log("Sent Data: "+dta);
        $("input#filter_keyword").val(null);
      }else{


      }
    });

    $('#submit_keyword_reset').on('click', function(event) {
      event.preventDefault(); 
      socket.emit('filter_keyword', "");
          console.log("Reset Filter");
          $("input#filter_keyword").val(null);
      
    });


   $('#submit_lang_en').on('click', function(event) {
      event.preventDefault();

      var data = "en";
      socket.emit('filter_lang', data);
        console.log("Updated Filter for Language: "+data);
        $("input#filter_lang").val(null);
              
    });


   $('#submit_lang_other').on('click', function(event) {
      event.preventDefault();

       var data = $("input#filter_lang").val();
      if(data.length > 0){
       socket.emit('filter_lang', data);
        console.log("Updated Filter for Language: "+data);
        $("input#filter_lang").val(null);
      }else{}

    });

     $('#submit_lang_reset').on('click', function(event) {
      event.preventDefault(); 
      socket.emit('filter_lang', "");
          console.log("Reset Language filter");
          $("input#filter_lang").val(null);
      
    });


     //updating the list of commands
     var numOfItems = 0;

     function updateNewList(data){
 
      if(numOfItems>3){
        $('#loc li:last').remove();
        --numOfItems;
      }

        //console.log(node.id, node.data.tags);

      try{

        if(data.filter.length>0){
              $('<li>Type: ' + data.type + '<p><mark>' + data.filter  + 
                '</mark><p></li>').prependTo('ul#loc');
              ++numOfItems;
            }
      }catch(e){

       // console.log(e);
      }


}




    //-----------------------------------------------------------

  //put an interval to make sure we update page periodically.
  var interval = setInterval(function(){loadLatestData()}, 20000);
