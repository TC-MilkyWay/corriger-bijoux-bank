console.log("Bijour Bank !");
/**
 * init foundation
 */
$(document).ready(function() {
    $(document).foundation();
});

/*declaration des variables*/
let solde = 0;
let msg = "on est bien";

const total = document.querySelector("#solde");
const btAll = document.getElementById("btAll");
const btDebit = document.querySelector("#btDebit");
const btCredit = document.querySelector("#btCredit");

const operationContainer = document.querySelector("#operationContainer");
let listeOperations = [];
if (localStorage.getItem("liste_operations") !== null) {
    listeOperations = JSON.parse(localStorage.getItem("liste_operations"));
    afficherListeOperations(listeOperations);
};

const formOperation = document.querySelector("#operationForm");

function afficherListeOperations(array) {
    //creer une boucle pour recuperer les operations//
    //pour chaque element du tableau , on definit le template html//
    //stocker tous les templates dans une variable//
    //afficher dans la liste des operations//
    operationContainer.innerHTML = "";
    array.forEach(function(element) {
            let classOperator = "debit";
            if (element.isCredit == true) {
                classOperator = "credit";
            }
            let template = `<div class="operation ${classOperator}">
            <div class="grid-x grid-padding-x align-middle">
                <div class="cell shrink">
                    <div class="picto">
                        <img src="./assets/images/${element.picto}" alt="credit" />
                    </div>
                </div>
                <div class="cell auto">
                    <div>
                        <h2>${element.titre}</h2>
                        <small>${element.desc}</small>
                    </div>
                </div>
                <div class="cell small-3 text-right">
                    <div>
                        <p class="count">${element.montant}€</p>
                        <small>${element.pourcent}%</small>
                    </div>
                </div>
            </div>
        </div>`;
            operationContainer.innerHTML += template;


        }

    );
}
/*afficherListeOperations();*/

//ecouter la soumission du formulaire
//recuperer les donnees du formulaire que l'on stocke dans un objet
//lobjet crée , on le pousse dans le tableau de la liste des operations en conservant la structure de notre objet et on 
//afficher la liste operation


formOperation.addEventListener("submit", function(event) {
    event.preventDefault();

    const dataForm = new FormData(this); /*recupere tous les valeurs des champs du formulaire*/
    /*console.log(dataForm.get("titre"));*/

    const operation = {
        titre: dataForm.get("titre"),
        desc: dataForm.get("desc"),
        montant: Number(dataForm.get("montant")),
        pourcent: (this.montant / solde) * 100,

    }
    if (solde == 0) {
        operation.pourcent = 100;
    } else {
        operation.pourcent = (operation.montant / solde) * 100;

    }
    if (dataForm.get("operator") === "credit") {
        operation.isCredit = true;
        operation.picto = "sac-dargent.png";
        solde += operation.montant;
    } else {
        operation.isCredit = false;
        operation.picto = "depenses.png";
        solde -= operation.montant;
    }
    listeOperations.push(operation);
    console.table(listeOperations);

    total.innerText = solde;

    afficherListeOperations(listeOperations);
    //formOperation.reset();
    //$("#exampleModal1").foundation("close");
    datapoints.push(solde);
    labels.push(labels.length + 1);
    chart.update();

    localStorage.setItem("liste_operations", JSON.stringify(listeOperations));
})

function filterOperationCredit(boolean) {

    const arrayCredit = listeOperations.filter(operation => {
        return operation.isCredit === boolean;
    });
    console.log("filter credit : ", arrayCredit);
    afficherListeOperations(arrayCredit);
}

btCredit.addEventListener("click", () => { filterOperationCredit(true) });

btAll.addEventListener("click", () => { afficherListeOperations(listeOperations) });

btDebit.addEventListener("click", () => { filterOperationCredit(false) });

localStorage.setItem("connected", "oui");
console.log(localStorage.getItem("connected"));

//const dataOff = localStorage.getItem("liste_operations");
//afficherListeOperations(JSON.parse(dataOff));