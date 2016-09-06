import { QuickSend, QuickQuote } from './models';
import { QuickSendView } from './views';

if (HAS_QUICK_SEND === true) {
    let contact = new QuickSend(),
        quote = new QuickQuote(),
        formView = new QuickSendView({ model: contact, quoteModel: quote });
    formView.render();
}