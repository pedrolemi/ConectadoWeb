// import ScrollListView from "../../../../framework/UI/scrollListView.js";
// import ConectadoEventNames from "../../../eventNames.js";

// export default class ChatListView extends ScrollListView {
//     constructor(scene, phone, screen, x, y, w, h, itemSpacing = 0, leftMargin = 0, rightMargin = 0, topMargin = 0, bottomMargin = 0) {
//         super(scene, x, y, w, h, itemSpacing, leftMargin, rightMargin, topMargin, bottomMargin);

//         this.phone = phone;

//         screen.dispatcher.add(ConectadoEventNames.phoneOpened, this, () => {
//             this.maskRect.setPosition(x, y);
//         });
//     }

//     preUpdate(t, dt) {
//         super.preUpdate(t, dt);
        
//         if (this.phone.toggleAnim != null) {
//             this.maskRect.setPosition(this.getWorldTransformMatrix().tx, this.getWorldTransformMatrix().ty);
//         }
//     }
// }