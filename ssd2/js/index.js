$(document).ready(function () {

    var clientid = "983487737789-09lvkbctsbnmbidte99mfghumn2a0bpm.apps.googleusercontent.com";
    var redirect = "https://localhost/ssd2/uploadfile.html";
    var projectscope = "https://www.googleapis.com/auth/drive";
    var clienturl = "";

    // listner to login button
    $('#signinbtn').click(function () { 
        //function signintoaccount is called in here
        AccoountSignIn(clientid,redirect,projectscope,clienturl);
    });

    function AccoountSignIn(clientid,redirect,projectscope,clienturl){

        //authorization end point 
        clienturl = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirect
        +"&prompt=consent&response_type=code&client_id="+clientid+"&scope="+projectscope
        +"&access_type=offline";
        
        window.location = clienturl;
    }
});