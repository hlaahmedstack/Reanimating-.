document.addEventListener('DOMContentLoaded', function(){

    // ==== عناصر الصفحة ====
    var awareness = document.getElementById('awareness');
    var login = document.getElementById('login');
    var dashboardDiv = document.getElementById('dashboard');
    var startBtn = document.querySelector('.start-btn');
    var loginBtn = document.getElementById('login-btn');
    var googleBtn = document.getElementById('google-login');
    var upload = document.getElementById('upload');
    var canvas = document.getElementById('canvas');
    var areaText = document.getElementById('area');
    var durationText = document.getElementById('duration');
    var progressFill = document.getElementById('progress-fill');
    var progressText = document.getElementById('progress-text');

    console.log("JS: جميع العناصر جاهزة");

    // ==== دالة الانتقال من Awareness لـ Login ====
    function showLogin(){
        if(awareness) awareness.style.display = 'none';
        if(login) login.style.display = 'block';
    }

    if(startBtn){
        startBtn.addEventListener('click', showLogin);
    }

    // ==== تسجيل دخول عادي ====
    if(loginBtn){
        loginBtn.addEventListener('click', function(){
            var emailInput = document.getElementById('email');
            var passwordInput = document.getElementById('password');
            if(emailInput && passwordInput && login && dashboardDiv){
                var email = emailInput.value.trim();
                var password = passwordInput.value.trim();
                if(email && password){
                    login.style.display = 'none';
                    dashboardDiv.style.display = 'block';
                    updateProgress(0);
                } else {
                    alert("من فضلك ادخلي البريد وكلمة المرور!");
                }
            }
        });
    }

    // ==== Google Login ====
    if(googleBtn){
        googleBtn.addEventListener('click', function(){
            alert("زر Google Login جاهز للربط لاحقًا");
            if(login && dashboardDiv){
                login.style.display = 'none';
                dashboardDiv.style.display = 'block';
                updateProgress(0);
            }
        });
    }

    // ==== Progress Bar ====
    function updateProgress(value){
        if(progressFill) progressFill.style.width = value + "%";
        if(progressText) progressText.textContent = "تقدم التحليل: " + value + "%";
    }

    // ==== رفع الصور وتحليل البقع ====
    if(upload && canvas && canvas.getContext && areaText && durationText){
        var ctx = canvas.getContext('2d');

        upload.addEventListener('change', function(e){
            var file = e.target.files[0];
            if(!file) return;

            var reader = new FileReader();
            reader.onload = function(event){
                var img = new Image();
                img.onload = function(){
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx.drawImage(img,0,0);
                    analyzeImage();
                }
                img.src = event.target.result;
            }
            reader.readAsDataURL(file);
        });

        function analyzeImage(){
            var imgData;
            try { imgData = ctx.getImageData(0,0,canvas.width,canvas.height); } 
            catch(err){ console.error("خطأ في تحليل الصورة:", err); return; }

            var data = imgData.data;
            var whitePixels = 0;
            for(var i=0;i<data.length;i+=4){
                var r=data[i], g=data[i+1], b=data[i+2];
                if(r>200 && g>200 && b>200) whitePixels++;
            }

            areaText.textContent = whitePixels;

            var minWeeks, maxWeeks, progressValue, statusText;
            if(whitePixels < 5000){ minWeeks=2; maxWeeks=4; progressValue=30; statusText="البقع قليلة";}
            else if(whitePixels < 20000){ minWeeks=6; maxWeeks=8; progressValue=60; statusText="البقع متوسطة";}
            else { minWeeks=10; maxWeeks=16; progressValue=90; statusText="البقع كبيرة"; }durationText.textContent = minWeeks + " - " + maxWeeks + " أسبوع";
            updateProgress(progressValue);
            if(progressText) progressText.textContent += " (" + statusText + ")";
        }
    }
});