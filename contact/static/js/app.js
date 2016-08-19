import { QuickSend } from './models';
import { QuickSendView } from './views';

if (HAS_QUICK_SEND === true) {
    let form = new QuickSend(),
        formView = new QuickSendView({ model: form });
    formView.render();
}