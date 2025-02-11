window.addEventListener("load",()=>{
const inputSearch = document.getElementById("inputSearch")
const titreNotes = document.getElementById("Notes")
const contenuNotes = document.getElementById("Notes_2")
const theme = document.querySelector(".theme i")
const ajoutNote =document.getElementById("ajoutNote")
const myForm= document.getElementById("myForm")
console.log(theme);

titreNotes.addEventListener("focus",()=>{
    contenuNotes.style.display= "block"
    titreNotes.placeholder = "Titre"
    ajoutNote.style.display="block"
})

theme.addEventListener("click",()=>{
    const themes= document.querySelector(".theme")
    themes.innerHTML= `<i class="fa-solid fa-grip-lines"></i>`
    const body = document.querySelector("body")
    body.classList.add('sombre')
})


// fonction de creation notes
function displayNotes(titre,contenu,id,couleur="white"){
    const contenuListe = document.querySelector(".contenu_liste")
    contenuListe.innerHTML+=`
    <div class="note_content" data-id="${id}" style="background-color:${couleur};">
       <div class="title">
          <h2>${titre}</h2>
       </div>
       <div class="contenu">
         <p>${contenu}</p>
       </div>
       <div class="action">
       <div class="outils">
       <i class="fa-solid fa-pen-to-square"></i>
       <i class="fa-solid fa-trash"></i>
       </div>
      
       <div class="palette_couleur">
         <div style="background-color: red;"></div>
         <div style="background-color: green;"></div>
         <div style="background-color: blue;"></div>
         <div style="background-color: yellow;"></div>
       </div>
       </div>
    </div>
    `
}

// ecouter l'evennement submit sur le formulaire
myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const titres = titreNotes.value.trim();
    const content = contenuNotes.value.trim();
   
    let editId = myForm.getAttribute("data-edit-id"); 

    if (editId) {
        editId = parseInt(editId);
        modificationNote(titres, content, editId); 

        myForm.removeAttribute("data-edit-id"); 
        ajoutNote.textContent = "Ajouter"; 
    } else {
        registerLocalStorage({ titres: titres, contenu: content, id: Date.now()});
    }

    document.querySelector(".contenu_liste").innerHTML = "";
    getData();
    myForm.reset(); 
});


// sauvegarde dans le localStorage
function registerLocalStorage(donnes){
    let save = []
    try{

        save = JSON.parse(localStorage.getItem("notes")) || []
        
    }catch(error){
        console.error("erreur de l'evoie", error.message);
        save = []
        
    }

    if (!Array.isArray(save)) {
        save = [];
    }

       if(!donnes.couleur){
           donnes.couleur = "white"
       }
       
       save.push(donnes)
       localStorage.setItem("notes",JSON.stringify(save))

}

// recuperation des donnes depuis le localStorage
function getData(){
    let  save = JSON.parse(localStorage.getItem("notes")) || []
    if(!Array.isArray(save)){
        save = []
    }
    
    save.forEach(note=>{
        displayNotes(note.titres,note.contenu,note.id,note.couleur || "white")
    })
}
getData()

// fonction pour supprimer une note
function removeNote(id){
    let  save = JSON.parse(localStorage.getItem("notes")) || []
    if(!Array.isArray(save)){
        save = []
    }
    
  save =  save.filter((note) =>note.id !==id)
  localStorage.setItem("notes",JSON.stringify(save))
}


    // suppression de note
    document.addEventListener("click",(e)=>{

        if(e.target.classList.contains("fa-trash")){

        const noteContent = e.target.closest(".note_content")

        if(noteContent){
            let id = parseInt(noteContent.dataset.id) 
            noteContent.remove()
            removeNote(id)
        }
    }
    })



// modification de notes
function modificationNote(titre,contenu){
let save = JSON.parse(localStorage.getItem("notes")) || []

let editId = myForm.getAttribute("data-edit-id")

if(editId){

    editId = parseInt(editId)
    save = save.map((note)=>{
        if(note.id === editId){
            return { ...note,titres: titre,contenu: contenu}
        }
        return note
    })
}else{
    save.push({titres: titre,contenu: contenu,id: Date.now()})
}

localStorage.setItem("notes",JSON.stringify(save))
}

 document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("fa-pen-to-square")){
        const noteContent = e.target.closest(".note_content")
        if(noteContent){
            // id de la note a modifier 
          let id = parseInt(noteContent.dataset.id)

        //   notes sur le local Storage
          let save = JSON.parse(localStorage.getItem("notes")) || []

        //   la note a modifier 
          let note = save.find((note) =>note.id ===id)

        //   affichage du note a modifier sur les champs de formulaire
          if(note){
            titreNotes.value = note.titres
            contenuNotes.value = note.contenu

            // ajout id au formulaire 
            myForm.setAttribute("data-edit-id",id)

            // changement de text au niveau du button d'envoie
            ajoutNote.textContent = "Modifier"
          }
        }
}
})



document.addEventListener("click",(e)=>{
    if(e.target.closest(".palette_couleur div")){
        const noteContent = e.target.closest(".note_content")
        if(noteContent){
            let save = JSON.parse(localStorage.getItem("notes")) || []
            let id = parseInt(noteContent.dataset.id)

            save = save.map((note)=>{

                if(note.id=== id){
                    return {...note,couleur: e.target.style.backgroundColor}
                }
                return note
            })

            localStorage.setItem("notes",JSON.stringify(save))

            noteContent.style.backgroundColor = e.target.style.backgroundColor
        }

    }
})



// couleur 
const colors = document.querySelectorAll(".palette_couleur div")
colors.forEach(color=>{
    color.addEventListener("click",(e)=>{
        const noteContent = e.target.closest(".note_content")
        if(noteContent){
            noteContent.style.backgroundColor=color.style.backgroundColor
            noteContent.style.color="white"
        }
      
    })
})

// gerer la barre de recherche 
inputSearch.addEventListener("input",(e)=>{
    let searchValue = e.target.value.toLowerCase()
    let save = JSON.parse(localStorage.getItem("notes")) || []

    let filterNotes = save.filter((note)=>{
        return note.titres.toLowerCase().includes(searchValue)

    })

    document.querySelector(".contenu_liste").innerHTML=''
    filterNotes.forEach((note)=>{
      displayNotes(note.titres,note.contenu,note.id,note.couleur || "white")
    })
})






})