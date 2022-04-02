PennController.ResetPrefix(null); // Shorten command names (keep this line here))
DebugOff()   // Uncomment this line only when you are 100% done designing your experiment

// First show instructions, then experiment trials, send results and show end screen
//Sequence("rDinstructions", "reverseDigits", "asq","stroopInstr", randomize("practice"), "endofprac", rshuffle("congruent","incongruent","neutral"), SendResults(),"end")
Sequence("counter","consent","rDinstructions", "reverseDigits","stroopInstr",randomize("practice"),"endofprac", rshuffle("congruent","incongruent","neutral"), SendResults(),"end")

// This is run at the beginning of each trial
Header(
    // Declare a global Var element "ID" in which we will store the participant's ID
    newVar("ID").global()    
)
//.log( "id" , getVar("ID") ) // Add the ID to all trials' results lines
.log( "id"                , getVar("prolific") )

SetCounter("counter", "inc", 1);

newTrial("consent",
    newHtml("cons","frame1Consent.html")
        .print()
    ,
    newTextInput("prolific", "")
            .settings.css("font-size", "24")
            .log()
            .print()
    ,
    newButton("Start")
        .css("font-size", "18pt")
        .center()
        .print()
        .wait()
    ,
    newVar("ID")
        .global()
        .set( getTextInput("prolific") )
)
.log( "ID" , getVar("ID") )

// Instructions for reverse digit span
newTrial("rDinstructions",
     // Automatically print all Text elements, centered
    defaultText.center().print().settings.css("font-size", "24")
    ,
    newText("<b>Reverse Digit Span</b>")
    ,
    newText("<p>In this task, you will hear a voice read a series of numbers.  Your job is to recall them in the reverse order in which you heard them.  So if you hear the digits \"1, 3, 4\" you would type \"431\" (without quotes) into an entry box.</p>")  
    ,
    newText("Please do not write the letters down in forward order before entering them in reverse order and do not using any scrap paper. \
    This is a hard task and it will get progressively more difficult. Just do the best you can.")
    ,
    newText("<p><strong>Make sure your sound is turned up.</strong> Are you ready? If so, click below to begin.</p>")
    ,
    newButton("I'm ready to start")
        .center()
        .css("margin","1em")
        .settings.css("font-size", "22")
        .print()
        .wait()
        // Only validate a click on Start when inputID has been filled
 //       .wait( getTextInput("inputID").testNot.text("") )
//    ,
    // Store the text from inputID into the Var element
//    getVar("ID").set( getTextInput("inputID") )
)

// First experiment trial
// Experimental trial
//Template("rdigitTable.csv", row =>
Template("rdigitTable.csv", row =>

    newTrial("reverseDigits",
        newButton("Play digits")
            .settings.css("font-size", "24")
            .center()
            .print()
            .wait()
            .remove()
        ,
        newAudio("audio", row.audio)
            .play()
            .wait()
        ,
        newText("Enter the digits you heard in reverse order below (no spaces)")
            .settings.css("font-size", "24")
            .center()
            .print()
        ,
        newTextInput("digits", "")
            .settings.css("font-size", "24")
            .length(row.length)
            .log()
            .center()
            .lines(1)
            .print()

        ,
        newButton("Click here to move on")
            .settings.css("font-size", "24")
            .center()
            .css("margin","1em")
            .print()
            .wait( getTextInput("digits").testNot.text("") )
        )
    // Log the participant's id, passed as a parameter in the URL (?id=...)
    .log( "id"                , GetURLParameter("id") )
    // Log values from table and from Var elements    .log("condition", audio)
    .log("audioFile", row.audio)
)

newTrial( "asq",
    newController("Form", { html: { include: "asq.html" },})
        .print()
        .log()
        .wait()
//    ,
//    newButton("Click here when you're ready to move on.")
//        .print()
//        .wait(getHtml("asqBody").test.complete())
)

// Instructions scree
newTrial("stroopInstr",
    // Automatically print all Text elements, centered
    defaultText.center().css("font-size", "16pt").print()
    ,
    newText("Great!")
    ,
    newText("For the next task, you will see colored words one at a time.")
    ,
    // Note: the \ character allows you to continue the string on the next line
    newText("<strong>Your task is to respond with the color that each word is written in.</strong>") 
    ,
    newText("<p>If the word is written in green, you should press the <strong>G</strong> key.</p>\
    <p>If the word is written in blue, you should press the <strong>B</strong> key.</p>\
    <p>If the word is written in red, you should press the <strong>R</strong> key.</p>\
    <p>If the word is written in yellow, you should press the <strong>Y</strong> key.</p>")
    ,
    newText("<p>Please respond as quickly and accurately as you can. You will have 2s to respond.</p>\
    <p>You will be given feedback on your performance.  This is a tough task.  Do the best you can.</p>")
    ,
    newButton("Click to start the experiment")
        .center()
        .print()
        .wait()     // Finish this trial only when the button is clicked
)

// Experimental trials: generate trials using the values from StroopTable.csv
Template( "StroopTable.csv" , row => 
  newTrial( 
    defaultText.center().css("font-size", "20pt")            // Horizontally center all Text elements automatically
    ,
    newText("reminder", "Press R for RED, B for BLUE, G for GREEN, Y for YELLOW")
        .settings.css("font-size", "20")
        .print("center at 50vw" , "center at 80vh")
        ,
    newText("fixation", "+")       // Show the text from the 'Word' column
        .css("font-size", "32pt")   
        .print("center at 50vw", "center at 50vh")
    ,
    newTimer(500).start().wait()
    ,
    getText("fixation")
        .remove()
    ,
    newText("word", row.Word)       // Show the text from the 'Word' column
        .color(row.FontColor)       // Color the text as specified in the 'FontColor' column
        .css("font-size", "32pt")   // Increase the font size
        .log()                      // Reports when the Text is displayed in the results file
        .print("center at 50vw", "center at 50vh")
    ,
    newText("slow","Too slow.  Try to respond more quickly.")
    ,
    newTimer("timeout",2000)
        //.callback( getText("slow").print() )
        .start()
    ,
    newKey("keypress", "RGBY")
        .log()                      // Reports when the key is pressed in the results file
        .wait()
        .callback(getTimer("timeout").stop())
    ,
    getTimer("timeout").test.ended()
        .failure(getKey("keypress").test.pressed( row.CorrectKey )
                            .success( newText("CORRECT!").print("center at 50vw", "center at 65vh") )
                            .failure( newText("INCORRECT!").print("center at 50vw", "center at 65vh") )
                            )
        .success(getText("slow").print("center at 50vw", "center at 65vh"))
    ,
    // Wait before moving to the next trial
    newTimer(500).start().wait()
  )
  .log( "word"    , row.Word       ) // Append the value of 'Word' at the end of the results lines
  .log( "color"   , row.FontColor  ) // Append the value of 'FontColor' at the end of the results lines
  .log( "correct" , row.CorrectKey ) // Append the value of 'CorrectKey' at the end of the results lines
  .log( "condition", row.Condition )// Append the value of 'Condition' at the end of the results lines
)

newTrial("endofprac" ,
      newCanvas("empty canvas", 1, 200)
         .print()    
    , 
    
    
    newText("This is the end of practice. When you are ready, press either Q or P to begin the formal task.")
        .settings.css("font-size", "24")
        .center()
        .print()
    ,
    
    newCanvas("empty canvas", 1, 30)
         .print()    
    , 
   
     newKey("keypress", "QP")
         .wait()   
)

newTrial("takebreak" ,
      newCanvas("empty canvas", 1, 200)
         .print()    
    , 
    
    
    newText("You're halfway through this task. Take a break! When you're ready to resume, press either Q or P.")
        .settings.css("font-size", "24")
        .center()
        .print()
    ,
    
    newCanvas("empty canvas", 1, 30)
         .print()    
    , 
   
     newKey("keypress", "QP")
         .wait()   
)


// Final screen
newTrial("end",
    newText("Thank you for taking part in this study. ")
        .center()
        .print()
    ,
    newText("Please copy the code 8F365494 and enter it manually in the Prolific website when you return.")        
        .center()
        .print()
    ,
    newText("Now you can close this window and return to Prolific.")        
        .center()
        .print()
    ,
    // Trick: stay on this trial forever (until tab is closed)
    newButton().wait()
)
.setOption("countsForProgressBar",false)