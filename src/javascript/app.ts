import FightersView from './fightersView';
import GameView from './gameView';
import Fighter from './fighter';
import { fighterService } from './services/fightersService';

class App {

  constructor() {
    this.startApp();
  }

  protected static startButton = document.getElementById('start');
  protected static readonly timeout = 1000;
  protected static rootElement = document.getElementById('root');
  protected static loadingElement = document.getElementById('loading-overlay');
  protected static fighters: Fighter[];
  protected static fightersView: FightersView;
  protected static fightersMap: Map<number, any>;
  protected static chooseHandler;
  protected static fighter1: Fighter;
  protected static fighter2: Fighter;

  async startApp() {
    try {
      App.loadingElement.style.visibility = 'visible';
      
      App.fighters = await fighterService.getFighters();
      App.fightersView = new FightersView(App.fighters);
      const fightersElement = App.fightersView.element;

      App.rootElement.appendChild(fightersElement);
    } catch (error) {
      console.warn(error);
      App.rootElement.innerText = 'Failed to load data';
    } finally {
      App.loadingElement.style.visibility = 'hidden';
      App.startButton.style.visibility = 'visible';
      App.startButton.addEventListener("click",App.handleStartClick);
    }
  }

  static async handleStartClick(){
    App.fightersMap = App.fightersView.fightersDetailsMap;
    App.rootElement.innerHTML="";
    App.chooseHandler = App.chooseFighterHandler.bind(this);
    App.fightersView = new FightersView(App.fighters,App.chooseHandler);
    const fightersElement = App.fightersView.element;
    const chooseFighters = document.createElement("h1");
    chooseFighters.innerHTML = "Choose Fighters";
    App.rootElement.appendChild(chooseFighters);
    App.rootElement.appendChild(fightersElement);
  }

  static async chooseFighterHandler(event: Event, fighter: Fighter){
    if(!App.fighter1){
      if(App.fightersMap.has(fighter._id)){
        App.fighter1 = App.fightersMap.get(fighter._id);
      }else{
        App.fighter1 = await fighterService.getFighterDetails(fighter._id);
      }
      document.getElementById(`f-${fighter._id}`).classList.add('fighter-1');
      return;
    }
    if(!App.fighter2){
      if(App.fightersMap.has(fighter._id)){
        App.fighter2 = App.fightersMap.get(fighter._id);
      }else{
        App.fighter2 = await fighterService.getFighterDetails(fighter._id);
      }
      document.getElementById(`f-${fighter._id}`).classList.add('fighter-2');
      setTimeout(() => {
        App.startFight(App.fighter1,App.fighter2)
      },App.timeout);
      return;
    }
  }

  static startFight(f1: Fighter,f2: Fighter){
    App.rootElement.innerHTML="";
    const gameView = new GameView(new Fighter(f1),new Fighter(f2));
    const gameElement = gameView.element;
    App.rootElement.appendChild(gameElement);
  }
}

export default App;