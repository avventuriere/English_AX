// This is a PCIbex implementation of the English AX discrimination task from Lab 1 in Colin Phillips' Psycholinguistics I class at the University of Maryland. The The original lab is available at http://www.colinphillips.net/teaching/4237-2/3154-2/
// We ask that if you use this code, you please credit Colin Phillips' 
// Psycholinguistics class, at the University of Maryland. See: www.colinphillips.net

// The Russian stimuli were created for
// Kazanina, Phillips & Idsardi. (2006). The influence of meaning on the perception of speech sounds. PNAS. 103(30), 11381-11386.
// If you use the Russian stimuli, please cite Kazanina et al (2006).

PennController.ResetPrefix(null) // Shorten command names (keep this)
PennController.DebugOff()

// Resources are hosted as ZIP files on a distant server

Sequence("instructions","practice",
            randomize("main.trial") ,
            "rest" ,
            randomize("main.trial") ,
            "rest" ,
            randomize("main.trial") ,
            "rest" ,
            randomize("main.trial") ,
            "send" , "end" )

// Welcome page: we do a first calibration here---meanwhile, the resources are preloading
newTrial("instructions",

    fullscreen(),
    
    newText(`<p>Welcome! In this experiment, you will hear pairs of sounds with a brief pause between them.</p>
            <p>Some pairs will sound very similar, while others will sound different.</p>
            <p>Your task is to decide whether the two sounds in each pair are the same or different.</p>
            <p>Make your judgment based on whether you think the two sounds would be labeled with the same letter, or, in other words, if they sound like the same letter to you. </p>
            <p>Press the 'J' button if the sounds are the SAME.</p>
            <p>Press the 'F' button if the sounds are DIFFERENT.</p>
            <p>Please try to respond as quickly and accurately as possible. If you take longer than 6 seconds to respond, the next sound will play automatically.</p>
            <p>Before the experiment starts, you will have a chance to practice.</p>
            <p>Click the button below when you are ready to begin the practice session.</p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")
    ,
    newButton("Start the practice")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);

newTrial("practice",

    newAudio("model","15dt.wav"),
    newAudio("same","05dt.wav"),
    newAudio("different","40dt.wav"),
    newKey("play-model", "B")
    .settings.callback(
        getAudio("model")
        .play("once")
        .remove()
        ),
       newKey("play-different", "F")
    .settings.callback(
        getAudio("different")
        .play("once")
        .remove()
        ),
    newKey("play-same", "J")
    .settings.callback(
        getAudio("same")
        .play("once")
        .remove()
        ),
    newText(`<p>This practice session will help you get familiar with the task and the sound contrasts.</p>
            <p>Press 'B' to hear a model sound.</p>
            <p>Press 'J' to hear an example of a sound that is different from the model, but would still be labeled with the same letter.</p> 
            <p>Press 'F' to hear an example of a sound that is different from the model and would be labeled with a different letter.</p>
            <p>When you are ready to begin the experiment, click the button below.</p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")

    ,
    newButton("Start the experiment")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);

Template( "English_DIS.csv",
    currentrow => 
    newTrial("main.trial",

    newText(`
            <div style="display: flex; justify-content: space-between;">
            <div style="text-align: center; width: 50%; padding-right: 100px;">
            <p>Press '<b>F</b>' for <br> <b>DIFFERENT</b></p>
            </div>
            <div style="text-align: center; width: 50%; padding-left: 100px;">
            <p>Press '<b>J</b>' for <br> <b>SAME</b></p>
            </div>
            </div>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%"),
    
    // Timing schedule:
    // Begin Sound 1 @ 500ms, 
    // Begin Timer and Sound 2 @ 1700ms
    // Record RT from onset of Sound 2

    newTimer("wait", 500)
        .start()
        .wait(),
    
    newAudio("cur.trial.sound1",currentrow.SoundFile1).play("once"),
    
    newTimer("ISI", 1200)
        .start()
        .wait(),    

    newTimer("deadline", 6000)
        .start(),

    newVar("RT").global().set( v => Date.now() ),

    newAudio("cur.trial.sound2",currentrow.SoundFile2).play("once"),

    newKey("cur.response", "J","F")
        .log("first")
        .callback( getTimer("deadline").stop()  )
        .callback( getVar("RT").set( v => Date.now() - v )),

    getTimer("deadline")
        .wait()  
    
    )
  .log( "A"   , currentrow.A)
  .log( "X"   , currentrow.X)
  .log( "RT"   ,getVar("RT") )
);

newTrial("rest",

    fullscreen(),
    
    newText(`<p>Please take a short break.</p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")
    ,
    newButton("All rested - ready to start again!")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);

SendResults("send");

newTrial("end",
    exitFullscreen()
    ,
    newText("The is the end of the experiment, you can now close this window. Thank you!")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
.setOption("countsForProgressBar",false);
