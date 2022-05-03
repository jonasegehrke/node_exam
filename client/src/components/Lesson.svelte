<script>
 export let subject;
 let color;

 if(subject === "Dansk"){
    color = "#46B1C9";
     }
     else if(subject == "Engelsk"){
    color = "#84c0c6";
     }
     else if(subject == "Historie"){
    color = "#9fb7b9";
     }
     else if(subject == "Matematik"){
    color = "#bcc1ba";
     }
     else if(subject == "Geografi"){
    color = "#F2E2D2";
     }

 
</script>

<div id="subject-container" style={`background-color: ${color};`} class="subject-container">
    <p>{subject}</p>
</div>

<style>

.subject-container {
    font-family: var(--primary-font);
    font-size: 1em;
    font-weight: 500;
    width: 150px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items:center;
    -webkit-box-shadow: inset 0px 0px 47px -3px #FFFFFF; 
box-shadow: inset 0px 0px 47px -3px #FFFFFF;

    
}

</style>