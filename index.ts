// Expo uygulamasının ana giriş dosyası.
// registerRootComponent: Uygulamanın en kök bileşenini (App.tsx) sisteme kaydeder.
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent fonksiyonu, arka planda AppRegistry.registerComponent('main', () => App) fonksiyonunu çağırır.
// Bu sayede uygulama hem Expo Go içinde hem de cihazlara özel derlenmiş yerel (native) paketlerde doğru şekilde başlar.
registerRootComponent(App);
