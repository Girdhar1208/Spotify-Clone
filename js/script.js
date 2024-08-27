// function smoothScrollToTop() {
//     window.scrollTo({
//         top: 0,
//         behavior: 'smooth'
//     });
// }
// smoothScrollToTop();  //problem 14 of advanced js
let currsong=new Audio();
let songs
function convertSeconds(seconds) {
    // Ensure the input is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zero if they are less than 10
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(remainingSeconds).padStart(2, '0');

    // Return the formatted string
    return `${paddedMinutes}:${paddedSeconds}`;
}



async function getsongs(){
    let a=await fetch('http://127.0.0.1:5500/spotify/playlist/');
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a"); 
    console.log(as);
    let songs=[];
    for (let i = 0; i <as.length; i++) {
        const element = as[i];
        if(element.href.endsWith('.mp3')){
            songs.push(element.href.split("/playlist/")[1]);
        }
        
    }
    return songs
}   //async function returns aa promise that's why we have made a main function which waits for the promise


const playmusic=(track,pause=false)=>{   //we have set pause at default so that our first song remains loaded until or unless next song is played
    currsong.src="/spotify/playlist/"+track;
    if(!pause){
        currsong.play();
        play.src="pause.svg";
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track);  //this decode uri will give the track name only
    document.querySelector(".songtime").innerHTML="00:00 / 00:00";
}



async function main(){
    // here we got the list of songs
    songs=await getsongs();
    playmusic(songs[0],true);
    // here we have added the songs to our song list
    let songul=document.querySelector('.songlist').getElementsByTagName('ul')[0];
    for (const song of songs) {
        songul.innerHTML=songul.innerHTML+`<li>
                      <img class="invert" src="img/music.svg" alt="music">
                      <div class="info">
                        <div>${song.replaceAll("%20"," ")}</div>
                        <div>Radhika</div>
                      </div>
                      <div class="playnow">
                        <span>Play now</span>
                        <img class="invert "src="img/play2.svg" alt="play">
                      </div>
                    </li>`
        
    }
  
    // attach an event listener to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e)=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
        
    })
    play.addEventListener("click",()=>{
        if(currsong.paused){
            currsong.play();
            play.src="img/pause.svg";
        }else{
            currsong.pause();
            play.src="img/playsong.svg";
        }

    })

    // updating the song time

    currsong.addEventListener("timeupdate",()=>{
        console.log(currsong.currentTime,currsong.duration,convertSeconds(currsong.currentTime));
        document.querySelector(".songtime").innerHTML=`${convertSeconds(currsong.currentTime)}/${convertSeconds(currsong.duration)}`
        document.querySelector(".circle").style.left=(currsong.currentTime/currsong.duration)*100+"%";
    })

    // add event listener to the seekbar
    document.querySelector(".seekbar").addEventListener("click",(e)=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100; //this will give that how much percent our circle has moved;
        document.querySelector(".circle").style.left=percent+"%";
        //now to change the duration of the song according to the position of circle in the seekbar;
        currsong.currentTime=(currsong.duration*percent)/100;

    })

    // add eventlistener to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    
    // add eventlistener to cross
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })

    // add an event listerner to previous
    document.querySelector("#previous").addEventListener("click",()=>{
        console.log("previous is clicked");
        let index=songs.indexOf(currsong.src.split("/").slice("-1")[0]);
        // console.log(index);
        if((index-1)>=0){
            playmusic(songs[index-1]);
        }
    })
    
    //add an event listener to next
    document.querySelector("#next").addEventListener("click",()=>{
        console.log("next is clicked");
        let index=songs.indexOf(currsong.src.split("/").slice("-1")[0]);
        // console.log(index);
        if((index+1)<songs.length){
            playmusic(songs[index+1]);
        }
        else{
            playmusic(songs[0]);
        }
    })

    // add an event listener to volume to change the volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("setting volume to " , e.target.value/100) //here we have divided it by 100 to set it out of 100
        currsong.volume=parseInt(e.target.value)/100;
    })
}
main();    
   