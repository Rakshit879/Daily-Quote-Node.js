const button = document.getElementById("generate_button");

button.addEventListener("click", async (event)=>{
    event.preventDefault();
    const quoteText = document.getElementById("quote");
    const quoteAuthor = document.getElementById("author");
    quoteText.innerText = "Generating.......";
    try{
        const response = await fetch("/quote");
        const data = await response.json();
        quoteText.innerText = `${data.content}`;
        quoteAuthor.innerText = `${data.author}`;
    }
    catch(err){
        console.log(err);
    }
})