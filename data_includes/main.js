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
    
    newText(`<p>Welcome! In this experiment, you will hear pairs of sounds, separated by a brief interval. </p>
            <p> Many will sound similar, and many will sound different.</p>
            <p> Your task is to decide which pairs are the same or different.</p>
            <p> Make your judgment based on whether you think the two sounds would be labeled with the same letter, or if they sound like the same letter to you. </p>
            Press the 'f' button if the sounds are the SAME.</p><p>
            Press the 'j' button if the sounds are DIFFERENT.</p><p>
            Try to respond as accurately and quickly as possible. If you wait more than 6 seconds, you will not be able to respond, and the next sound will be played.</p><p>
            Before you begin, you will have a chance to practice a little bit.</p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")
    ,
    newButton("Click when you are ready to begin")
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
    newKey("play-model", "BF")
    .settings.callback(
        getAudio("model")
        .play("once")
        .remove()
        ),
       newKey("play-same", "J")
    .settings.callback(
        getAudio("different")
        .play("once")
        .remove()
        ),
    newKey("play-different", "N")
    .settings.callback(
        getAudio("same")
        .play("once")
        .remove()
        ),
    newText(`<p>This is practice. Press 'b' for a model sound.</p><p>
            Press 'f' for an example of a sound that is the same as the model.</p><p>
            Press 'j' for an example of a sound that is different from the model.</p><p>
            Press 'n' for an example of a sound that is different from the model, but could get the same letter label as the model.</p><p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")

    ,
    newButton("I'm ready to begin")
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

    newText(`<p>Remember:</p><p>
            For SAME sounds press the 'f' key after the second sound.</p><p>
            For DIFFERENT sounds press the 'j' key after the second sound.</p><p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "24px")
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

    newKey("cur.response", "F","J")
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