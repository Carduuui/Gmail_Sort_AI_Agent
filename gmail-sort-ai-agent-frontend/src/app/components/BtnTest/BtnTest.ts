import { Component } from "@angular/core";

@Component({
    selector: "app-btn-test",
    templateUrl: "./BtnTest.html",
    styleUrl: "./BtnTest.scss"
})

export class MyBtnTestComponent{
    onClick(){
        console.log("Btn geklickt!");
    }
}