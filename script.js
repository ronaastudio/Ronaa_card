function copyNumber(){

const number="09211027647";

navigator.clipboard.writeText(number);

const btn=document.querySelector("button");

btn.innerHTML="✅ شماره کپی شد";

setTimeout(()=>{

btn.innerHTML="کپی شماره";

},2000);

}

// افکت ظاهر شدن دکمه‌ها

const buttons=document.querySelectorAll(".btn");

buttons.forEach((btn,index)=>{

btn.style.opacity="0";
btn.style.transform="translateY(25px)";

setTimeout(()=>{

btn.style.transition=".6s";
btn.style.opacity="1";
btn.style.transform="translateY(0)";

},300+(index*150));

});

// انیمیشن لوگو

const logo=document.querySelector(".logo");

logo.animate([
{
transform:"scale(.8)",
opacity:0
},
{
transform:"scale(1.08)",
opacity:1
},
{
transform:"scale(1)"
}
],
{
duration:1200,
fill:"forwards"
});

// ذخیره مخاطب

const contactButton=document.createElement("button");

contactButton.innerHTML="💾 ذخیره مخاطب";

contactButton.style.marginTop="15px";

contactButton.onclick=function(){

window.location.href=`data:text/vcard;charset=utf-8,
BEGIN:VCARD
VERSION:3.0
FN:RONA Studio
TEL;TYPE=CELL:09211027647
END:VCARD`;

};

document.querySelector(".info").appendChild(contactButton);
function openPayment(){
document.getElementById("paymentModal").style.display="flex";
}

function closePayment(){
document.getElementById("paymentModal").style.display="none";
document.getElementById("cardBox").style.display="none";
}

function showCard(){
document.getElementById("cardBox").style.display="block";
}

function copyCard(){

const card="6063731135919406";

navigator.clipboard.writeText(card);

alert("✅ شماره کارت کپی شد");
}
