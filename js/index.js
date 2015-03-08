    
    //connect to the Mongo database

    var socket = io.connect('http://sociamvm-app-001.ecs.soton.ac.uk:9001');
    //call this when the page loads 

    var filter = false;
    var active_users = 0;
    var current_filter_keyword = "";

    socket.on('user_heartbeat', function (data) {
         socket.emit("active_user","");
      //sent a signal to the server to let them know you're here!
    });

    //check for active filters
    socket.emit("filter","");



    socket.on('filter', function (data) {
       filter = data;
      //sent a signal to the server to let them know you're here!
    });


    //Check for an filtering going on for the keyword
    socket.on('set_filter_keyword', function (data) {
      console.log(data)
      current_filter_keyword = data;
      $("#currentFilter span").html(current_filter_keyword);

      //sent a signal to the server to let them know you're here!
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

    socket.on('callback', function(data) {
    console.log(data.done);
      // Print the data.data somewhere...
    });


//put an interval to make sure we update page periodically.

var interval = setInterval(function(){loadLatestData()}, 20000);
