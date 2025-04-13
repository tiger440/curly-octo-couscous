import jsPDF from "jspdf";
import { PDF_FONT_BOLD, PDF_FONT_BOLD_ITALIC, PDF_FONT_ITALIC, PDF_FONT_NORAML } from "./fonts";

const PAGE_WIDTH = 210
const X_PADDING = 12
const X_PADDING_RIGHT = PAGE_WIDTH - 12
const Y_SHIFT = 9
let accumulatedHeight = 0;


const cornerBorders = {
    'oui': 'data:image/png;base64,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SIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIj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',
    'enCours': 'data:image/png;base64,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jCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNIjCAxgsQIEiNI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',
    'non': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAfQCAYAAAA0Hvq5AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAABf0SURBVHgB7d1NclzXeYDhcxus0s/E9AqMiRNKEyMrMLMCyQMntCamV2BlBXJWIGcFdkZJRklWIGcFckZJRlJWQItyVeyKic69TUAhxR8ARKP7BfA8VRJFUiVV4eV3zrn3djemwZX4nwf3Dp88eXL3+ODgaD1Nd1djfG+9Xt8d03S4HuPuePrX/NPp7lh+/cQ0uJTlC/+/x8dH64ODw2m9/sH8xT+av8iHz36RL0KQC/r6wb37x8sXfYwfzn/Slx8PxxYJcobf//j7R0/u3Lk/f6E+mNeXozf9k39egrzEMgXzF/+D4zE+3PYEnEWQE6cR5j3g4VVPwevc6iCPPjy8e+fdd38+7wUf7zPCs25lkGUa5kn4ZP7H+yPm1gQpTsPL3Pgg1yXEqRsb5LqFOHXjglzXEKduTJDrHuLUjQjy+K/+7MNxcPDp2PFF3FW41kEezTf2DqbpVyN4fH1Tq3FNff3R+58crFafjxsUY3HtJuTkom6ZisNxA12rCfn6J+99Osf4bNzQGItrMSHLXnFnmv55ef4wbrj8hPz+o/d+vuwVtyHGIjshm+uKd975ZHNdcYskg9ymJerbDkbMcoqaVqsbvXG/TmoPWfaLzSnqGt/6uKxMkHkyPjlej1+OW27ve8iyeR+8++6n81Q8HOw3yMlJ6rPbuHm/yt6C3OaT1OvsJcjJXdpbe5J6nZ0HEeP1dhpEjLPt7Ni72cDnPWOI8Vo7C+I0dT47CfL4o/d/Jcb5XHmQ5QrcRd/5XemmvsSY7039YnBuVxbk5Nn3Z4MLuZIlaznenrwQgQva+oRsbha+887y8pzDwYVtfUKWx65DjDe21SCbB0y37Bn4tm1tydrcFlleSXiLn/Ztw9Ym5OCWP3rdlq0E2Vz82Te24tJL1skd3C8GW3HpCTlw8bdVlwpiqdq+N16yLFVX440nZI7x6WDr3ijI4wf3Hs4/fDjYujebkKcfS8EVuHAQG/nVulCQk9vqDwdX5kJB5ntVpuOKnfvY65i7G+eekJPp4Iqda0JMx+6ca0JMx+6cGWSZjvk5x/3BTpwZ5ODpZ4kcDnbi7CXLVflOvTbIyT2rw8HOnDUhPx3s1CuPvY66+/HKCVlNk9dX7cErg2y+GwA799Igmw+mt5nvxUuDrFcrm/mevHzJcmW+Ny8EsVzt1wtBLFf79eKSZbnaq+eCPPrx95e3Lh8O9ua5IKs7d+4P9uq5INN67WJwz57fQ1Yrn7awZ98E2Rx3vQNq774Jsnw70cHefRNk+d6ug717dg8xIQGbII8eHi17x+Fg7zZB7vzhD6YjYhPk+IZ926DrbBNkmqYfDBKeBrF/ZGyCrKfpcJCw2pywXKFnrJywWlbzcmU6QlZrG3rKsqkfDjJWNvSW1XwN8r1BxrX9btE31Wq4KEwxITHLhNjUQ5yyYixZMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIjSIwgMYLECBIj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',
}

const sectionOrder = [
    { title: 'organization', value: "Organisation" },
    { title: 'positioning', value: "Positionnement" },
    { title: 'innovation', value: 'Innovation' },
    { title: 'quality', value: "Qualité" },
    { title: 'strategie', value: "Stratégie RSE" }
]

export const downloadPDF = async (adviceData, entrepriseData, totalValuation, convertToThousands, capital, enterpriseName) => {


    const measureHeight = async () => {
        let current_y = 11;
        try {
            const doc = new jsPDF({
                orientation: 'p',
                format: [PAGE_WIDTH, 750]
            });
            // FONT CONFIGS
            doc.addFileToVFS('transducerNormal.ttf', PDF_FONT_NORAML);
            doc.addFont('transducerNormal.ttf', 'transDucer', 'normal');

            doc.addFileToVFS('transducerItalic.ttf', PDF_FONT_ITALIC);
            doc.addFont('transducerItalic.ttf', 'transDucer', 'italic');

            doc.addFileToVFS('transducerBold.ttf', PDF_FONT_BOLD);
            doc.addFont('transducerBold.ttf', 'transDucer', 'bold');

            doc.addFileToVFS('transducerBoldItalic.ttf', PDF_FONT_BOLD_ITALIC);
            doc.addFont('transducerBoldItalic.ttf', 'transducerBoldItalic', 'normal');

            doc.setFont('transDucer');
            doc.setTextColor('#212B36')
            // BACKGROUND
            const { imgStr: imgString }: any = await imgToBase64('./PDF/A4-Background.png')
            const width = doc.internal.pageSize.getWidth();
            const height = doc.internal.pageSize.getHeight();
            doc.addImage(imgString as string ?? '', 'PNG', 0, 0, width, height)
            // Header
            const { imgStr: logoString, width: logoWidth, height: logoHeight }: any = await imgToBase64('./PDF/Logo-hermes.png')
            doc.addImage(logoString as string ?? '', 'PNG', X_PADDING, current_y, logoWidth / 22, logoHeight / 22)
            doc.setFontSize(8)
            doc.text("Rendez-vous sur", X_PADDING + 133, current_y + 6);
            doc.setTextColor('#F25929')
            doc.setFont('transDucer', 'italic');
            doc.textWithLink("hermes.fr", X_PADDING_RIGHT, current_y + 6, { url: 'https://hermes.fr', align: "right" });
            doc.setTextColor('#212B36')
            doc.setFont('transDucer', 'normal');

            // Meta data section
            current_y += (Y_SHIFT * 3)
            doc.setFontSize(15)
            doc.text("Vos résultats", X_PADDING, current_y)
            doc.setFontSize(8)
            doc.text(`Valorisation effectuée le ${currentDateFrench()}`, X_PADDING_RIGHT, current_y, { align: "right" })
            current_y += Y_SHIFT
            const { imgStr: structure1String, width: structure1Width, height: structure1Height }: any = await imgToBase64('./PDF/structure-1.png')
            doc.addImage(structure1String as string ?? '', 'PNG', X_PADDING - 4.5, current_y - 1, structure1Width / 5.7, structure1Height / 5.7)
            const { imgStr: defaultLogoString, width: defaultLogoWidth, height: defaultLogoHeight }: any = await imgToBase64('./PDF/default-logo-jpg.jpg')
            doc.addImage(defaultLogoString as string ?? '', 'PNG', X_PADDING + 2, current_y + 3, defaultLogoWidth / 5.7, defaultLogoHeight / 5.7)
            doc.text((enterpriseName ?? "Nom entreprise"), X_PADDING + 19, current_y + 9)
            doc.setTextColor('#919EAB')
            doc.text(`En activité depuis le :${entrepriseData?.uniteLegale?.dateCreationUniteLegale ?? 'NA'}`, X_PADDING + 19, current_y + 14)
            doc.setFontSize(7)
            doc.setTextColor('#ffffff')
            doc.text(`Capital de  ${capital ?? '0 €'}`, 157, current_y + 10)
            doc.setTextColor('#919EAB')
            doc.text("Siège social : NA", 157, current_y + 16)
            current_y += (defaultLogoWidth / 5.7) + 2
            current_y += Y_SHIFT
            const { imgStr: s2Img, width: s2Width, height: s2height }: any = await imgToBase64('./PDF/Section-2.png')
            doc.addImage(s2Img as string ?? '', 'PNG', X_PADDING, current_y, s2Width / 5.7, s2height / 5.7)
            doc.setFontSize(13)
            doc.setTextColor('#ffffff')
            const wrappedTextFirstSection = doc.splitTextToSize('Votre entreprise est en constante évolution.', 80);
            doc.text(wrappedTextFirstSection, X_PADDING + 8, current_y + 15);
            doc.setFontSize(9)
            doc.setTextColor('#ffffff')
            const wrappedTextSection = doc.splitTextToSize('Figma ipsum component variant main layer. Pour optimiser votre performance financière, réduisez votre masse salariale.', 90);
            doc.text(wrappedTextSection, X_PADDING + 8, current_y + 29);
            const { imgStr: s3Img, width: s3Width, height: s3height }: any = await imgToBase64('./PDF/Section-3.png')
            doc.addImage(s3Img as string ?? '', 'PNG', X_PADDING + (s2Width / 5.7) + 5, current_y, s3Width / 5.7, s3height / 5.7)
            current_y += s2height / 5.7
            doc.setFontSize(12)
            doc.setTextColor('#023A80')
            const wrappedText = doc.splitTextToSize('La valeur de votre entreprise s’élève à', 60);
            doc.text(wrappedText, X_PADDING + (s2Width / 5.7) + 43, current_y - 35, { align: 'center' });
            doc.setFontSize(18)
            const wrappedTextATitle = doc.splitTextToSize(`${totalValuation ? `${convertToThousands(totalValuation)} €` : "0 €"}`, 54);
            doc.text(wrappedTextATitle, X_PADDING + (s2Width / 5.7) + 43, current_y - 18, { align: 'center' });
            doc.setTextColor('#212B36')

            // ******
            // Advice section
            current_y += (Y_SHIFT * 2)
            doc.setFontSize(15)
            doc.setTextColor('#ffffff')
            doc.text("Pour aller plus loin", X_PADDING, current_y)
            doc.setFontSize(8)
            current_y += Y_SHIFT - 2
            doc.text(`Découvrez les points à améliorer pour augmenter la valeur de votre entreprise.`, X_PADDING, current_y)

            const spacingBetweenAdviseSection = 50;

            sectionOrder.forEach((adviceCategory, index) => {
                drawAdviceCard(doc, adviceData, adviceCategory, current_y, index);
                if (adviceData[adviceCategory.title]?.length <= 2) {
                    if (adviceData[adviceCategory.title]?.length > 0) {
                        current_y += (Y_SHIFT + spacingBetweenAdviseSection);
                    }
                } else {
                    if (adviceData[adviceCategory.title]?.length > 0) {
                        current_y += (Y_SHIFT + spacingBetweenAdviseSection + 45);
                    }
                }
                doc.setDrawColor('#DFE3E8')
                doc.setLineDashPattern([1, 0.25], 0)
                if (adviceData[adviceCategory?.title]?.length > 0) {
                    if (index > sectionOrder.length - 1) {
                        doc.line(X_PADDING, current_y + 10, PAGE_WIDTH - (X_PADDING), current_y + 10)
                    }
                }
            })

            doc.setFontSize(10)
            current_y += Y_SHIFT + 7
            doc.text("Retrouvez toutes les informations complémentaires dans la rubrique “Mes valorisations” sur votre compte Hermes", PAGE_WIDTH / 2, current_y, { align: "center", maxWidth: PAGE_WIDTH - (2 * X_PADDING) })
            doc.setTextColor('#ff0000')
            doc.text("“Mes valorisations”", 149.170, current_y)

            current_y += Y_SHIFT + 7;
            addHeader(doc, current_y)
            addFooters(doc, current_y)
            accumulatedHeight = current_y + 18; // 18 is footer H

        } catch (error) {
            console.error('Error while generating PDF :>> ', error);
        }

        return accumulatedHeight;
    }

    const dynamicHeight = await Promise.resolve(measureHeight())


    let current_y = 11;
    try {
        const doc = new jsPDF({
            orientation: 'p',
            format: [PAGE_WIDTH, dynamicHeight]
        });
        // FONT CONFIGS
        doc.addFileToVFS('transducerNormal.ttf', PDF_FONT_NORAML);
        doc.addFont('transducerNormal.ttf', 'transDucer', 'normal');

        doc.addFileToVFS('transducerItalic.ttf', PDF_FONT_ITALIC);
        doc.addFont('transducerItalic.ttf', 'transDucer', 'italic');

        doc.addFileToVFS('transducerBold.ttf', PDF_FONT_BOLD);
        doc.addFont('transducerBold.ttf', 'transDucer', 'bold');

        doc.addFileToVFS('transducerBoldItalic.ttf', PDF_FONT_BOLD_ITALIC);
        doc.addFont('transducerBoldItalic.ttf', 'transducerBoldItalic', 'normal');

        doc.setFont('transDucer');
        doc.setTextColor('#212B36')
        // BACKGROUND
        const { imgStr: imgString }: any = await imgToBase64('./PDF/A4-Background.png')
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        doc.addImage(imgString as string ?? '', 'PNG', 0, 0, width, height)
        // Header
        const { imgStr: logoString, width: logoWidth, height: logoHeight }: any = await imgToBase64('./PDF/Logo-hermes.png')
        doc.addImage(logoString as string ?? '', 'PNG', X_PADDING, current_y, logoWidth / 22, logoHeight / 22)
        doc.setFontSize(8)
        doc.text("Rendez-vous sur", X_PADDING + 133, current_y + 6);
        doc.setTextColor('#F25929')
        doc.setFont('transDucer', 'italic');
        doc.textWithLink("hermes.fr", X_PADDING_RIGHT, current_y + 6, { url: 'https://hermes.fr', align: "right" });
        doc.setTextColor('#212B36')
        doc.setFont('transDucer', 'normal');

        // Meta data section
        current_y += (Y_SHIFT * 3)
        doc.setFontSize(15)
        doc.text("Vos résultats", X_PADDING, current_y)
        doc.setFontSize(8)
        doc.text(`Valorisation effectuée le ${currentDateFrench()}`, X_PADDING_RIGHT, current_y, { align: "right" })
        current_y += Y_SHIFT
        const { imgStr: structure1String, width: structure1Width, height: structure1Height }: any = await imgToBase64('./PDF/structure-1.png')
        doc.addImage(structure1String as string ?? '', 'PNG', X_PADDING - 4.5, current_y - 1, structure1Width / 5.7, structure1Height / 5.7)
        const { imgStr: defaultLogoString, width: defaultLogoWidth, height: defaultLogoHeight }: any = await imgToBase64('./PDF/default-logo-jpg.jpg')
        doc.addImage(defaultLogoString as string ?? '', 'PNG', X_PADDING + 2, current_y + 3, defaultLogoWidth / 5.7, defaultLogoHeight / 5.7)
        doc.text((enterpriseName ?? "Nom entreprise"), X_PADDING + 19, current_y + 9)
        doc.setTextColor('#919EAB')
        doc.text(`En activité depuis le :${entrepriseData?.uniteLegale?.dateCreationUniteLegale ?? 'NA'}`, X_PADDING + 19, current_y + 14)
        doc.setFontSize(7)
        doc.setTextColor('#ffffff')
        doc.text(`Capital de  ${capital ?? '0 €'}`, 157, current_y + 10)
        doc.setTextColor('#919EAB')
        doc.text("Siège social : NA", 157, current_y + 16)
        current_y += (defaultLogoWidth / 5.7) + 2
        current_y += Y_SHIFT
        const { imgStr: s2Img, width: s2Width, height: s2height }: any = await imgToBase64('./PDF/Section-2.png')
        doc.addImage(s2Img as string ?? '', 'PNG', X_PADDING, current_y, s2Width / 5.7, s2height / 5.7)
        doc.setFontSize(13)
        doc.setTextColor('#ffffff')
        const wrappedTextFirstSection = doc.splitTextToSize('HERMES et ses partenaires spécialisés vous accompagnent dans divers domaines stratégiques, afin de maximiser la valeur de votre entreprise.', 80);
        doc.text(wrappedTextFirstSection, X_PADDING + 8, current_y + 15);
        doc.setFontSize(9)
        doc.setTextColor('#ffffff')
        const { imgStr: s3Img, width: s3Width, height: s3height }: any = await imgToBase64('./PDF/Section-3.png')
        doc.addImage(s3Img as string ?? '', 'PNG', X_PADDING + (s2Width / 5.7) + 5, current_y, s3Width / 5.7, s3height / 5.7)
        current_y += s2height / 5.7
        doc.setFontSize(12)
        doc.setTextColor('#023A80')
        const wrappedText = doc.splitTextToSize('La valeur de votre entreprise s’élève à', 60);
        doc.text(wrappedText, X_PADDING + (s2Width / 5.7) + 43, current_y - 35, { align: 'center' });
        doc.setFontSize(18)
        const wrappedTextATitle = doc.splitTextToSize(`${totalValuation ? `${convertToThousands(totalValuation)} €` : "0 €"}`, 54);
        doc.text(wrappedTextATitle, X_PADDING + (s2Width / 5.7) + 43, current_y - 18, { align: 'center' });
        doc.setTextColor('#212B36')

        // ******
        // Advice section
        current_y += (Y_SHIFT * 2)
        doc.setFontSize(15)
        doc.setTextColor('#ffffff')
        doc.text("Pour aller plus loin", X_PADDING, current_y)
        doc.setFontSize(8)
        current_y += Y_SHIFT - 2
        doc.text(`Découvrez les points à améliorer pour augmenter la valeur de votre entreprise.`, X_PADDING, current_y)

        const spacingBetweenAdviseSection = 50;

        sectionOrder.forEach((adviceCategory, index) => {
            drawAdviceCard(doc, adviceData, adviceCategory, current_y, index);
            if (adviceData[adviceCategory.title]?.length <= 2) {
                if (adviceData[adviceCategory.title]?.length > 0) {
                    current_y += (Y_SHIFT + spacingBetweenAdviseSection);
                }
            } else {
                if (adviceData[adviceCategory.title]?.length > 0) {
                    current_y += (Y_SHIFT + spacingBetweenAdviseSection + 45);
                }
            }
            doc.setDrawColor('#DFE3E8')
            doc.setLineDashPattern([1, 0.25], 0)
            console.log('adviceData[adviceCategory.title]?.length', adviceData[adviceCategory.title]?.length)
            if (adviceData[adviceCategory.title]?.length !== undefined) {
                if (index + 1 !== sectionOrder?.length) {
                    doc.line(X_PADDING, current_y + 10, PAGE_WIDTH - (X_PADDING), current_y + 10)
                }
            }
        })

        doc.setFontSize(10)
        current_y += Y_SHIFT + 7
        doc.setTextColor('#000000')
        doc.text("Retrouvez toutes les informations complémentaires dans la rubrique “Mes valorisations” sur votre compte Hermes", PAGE_WIDTH / 2, current_y, { align: "center", maxWidth: PAGE_WIDTH - (2 * X_PADDING) })
        doc.setTextColor('#f25929')
        doc.text("“Mes valorisations”", 149.170, current_y)

        current_y += Y_SHIFT + 7;
        addHeader(doc, current_y)
        addFooters(doc, current_y)
        doc.save("Result.pdf");
    } catch (error) {
        console.error('Error while generating PDF 2 :>> ', error);
    }



}

const drawAdviceCard = (doc, data, DataCategory, current_Y, index) => {
    const dataCategory = DataCategory.title;
    if (data[dataCategory]?.length > 0) {

        let current_y = current_Y;
        doc.setFontSize(12);
        current_y += Y_SHIFT * 2;
        if (index > 2) {
            doc.setTextColor('#000000')
        }
        doc.text(DataCategory.value, X_PADDING, current_y)

        data[dataCategory]?.forEach((advice, index) => {
            doc.setFontSize(10);
            const cardHeight = 40;
            const borderRadius = 2;
            const spaceBetweenCards = 5;
            const cardWidth = (PAGE_WIDTH - (2 * X_PADDING) - spaceBetweenCards) / 2;

            if (index % 2 == 0) {
                current_y += 5;
            }

            if ((index + 2) % 2 == 0) {

                //drawing Rect
                doc.setFillColor('#ffffff')
                doc.roundedRect(X_PADDING, current_y, cardWidth, cardHeight, borderRadius, borderRadius, 'F')
                const answer = advice.answer;

                if (answer === "oui") doc.setFillColor('#0373ff');
                else if (answer === 'non') doc.setFillColor('#f25929');
                else if (answer === "enCours") doc.setFillColor('#ffab00');

                doc.addImage(cornerBorders[answer] as string ?? '', 'PNG', X_PADDING - 0.25, current_y, 2, 40)


                //title
                const adviceTitle = (advice.title)
                const maxWidth = 63;
                const fontSize = 10;

                doc.setFontSize(10).setFont(undefined, 'normal');
                const firstLineWidth = measureFirstLineWidth(doc, adviceTitle, maxWidth, fontSize);
                const lines = doc.splitTextToSize(adviceTitle, maxWidth);
                const noOfLines = lines.length;

                let adviceDesc = "";

                doc.setTextColor('#000000')
                doc.setFontSize(10).setFont(undefined, 'normal');
                doc.text(adviceTitle, X_PADDING + 5, current_y + 8, { maxWidth: maxWidth, align: 'left' });
                doc.setTextColor('#ffffff')

                const ansWidth = doc.getTextDimensions(answer)?.w
                const ansHeight = doc.getTextDimensions(answer)?.h

                if (answer === "oui") doc.setFillColor('#0373ff');
                else if (answer === 'non') doc.setFillColor('#f25929');
                else if (answer === "enCours") doc.setFillColor('#ffab00');

                doc.roundedRect((X_PADDING + 5) + (firstLineWidth + 3) + 2, current_y + 4, ansWidth + 2, ansHeight + 2, 1, 1, 'F')

                doc.setTextColor('#000000')
                doc.setFontSize(10);
                doc.text("|", (X_PADDING + 5) + (firstLineWidth + 2), current_y + 8)

                doc.setTextColor('#ffffff')
                doc.setFontSize(10);
                doc.text(answer, (X_PADDING + 5) + (firstLineWidth + 3) + 3, current_y + 8)

                doc.setTextColor('#ffffff')

                //description
                doc.setFontSize(8).setFont(undefined, 'normal');

                const oneLineLength = 43;
                for (let i = 0; i <= oneLineLength * 5; i += oneLineLength) {
                    adviceDesc += (advice.description.substr(i, oneLineLength).trim() + "\n");
                }

                if (adviceDesc.length > (oneLineLength * 5) - 3) {
                    adviceDesc = adviceDesc.substr(0, ((oneLineLength * 5) - 3)) + "...";
                }
                doc.setFontSize(7).setFont(undefined, 'normal');
                doc.setTextColor('#919EAB')
                doc.text(adviceDesc, X_PADDING + 5, current_y + (noOfLines === 2 ? 18 : 15));
                doc.setTextColor('#ffffff')

                // En saviour Text
                doc.setFontSize(7).setFont(undefined, 'normal');
                doc.setTextColor('#0373ff')
                doc.text("En savoir plus", X_PADDING + 5, current_y + 35)
                doc.setTextColor('#ffffff')

            } else {
                //drawing Rect
                doc.setFillColor('#ffffff')
                doc.roundedRect((X_PADDING + spaceBetweenCards + cardWidth), current_y, cardWidth, cardHeight, borderRadius, borderRadius, 'F')
                const answer = advice.answer;
                if (answer === "oui") doc.setFillColor('#0373ff');
                else if (answer === 'non') doc.setFillColor('#f25929');
                else if (answer === "enCours") doc.setFillColor('#ffab00');
                doc.addImage(cornerBorders[answer] as string ?? '', 'PNG', X_PADDING + spaceBetweenCards + cardWidth, current_y, 2, 40)


                //Setting Data

                //title

                const adviceTitle = (advice.title)
                const maxWidth = 60;
                const fontSize = 10;

                doc.setFontSize(10).setFont(undefined, 'normal');
                const firstLineWidth = measureFirstLineWidth(doc, adviceTitle, maxWidth, fontSize);
                const lines = doc.splitTextToSize(adviceTitle, maxWidth);
                const noOfLines = lines.length;

                doc.setTextColor('#000000')
                doc.setFontSize(10).setFont(undefined, 'normal');
                doc.text(adviceTitle, (X_PADDING + spaceBetweenCards + cardWidth) + 5, current_y + 8, { maxWidth: maxWidth, align: 'left' });
                doc.setTextColor('#ffffff')

                const ansWidth = doc.getTextDimensions(answer)?.w
                const ansHeight = doc.getTextDimensions(answer)?.h

                if (answer === "oui") doc.setFillColor('#0373ff');
                else if (answer === 'non') doc.setFillColor('#f25929');
                else if (answer === "enCours") doc.setFillColor('#ffab00');


                doc.roundedRect((X_PADDING + spaceBetweenCards + cardWidth + 5) + (firstLineWidth + 3) + 2, current_y + 4, ansWidth + 2, ansHeight + 2, 1, 1, 'F')

                doc.setTextColor('#000000')
                doc.setFontSize(10);
                doc.text("|", (X_PADDING + spaceBetweenCards + cardWidth + 5) + (firstLineWidth + 2), current_y + 8)

                doc.setTextColor('#ffffff')
                doc.setFontSize(10);

                doc.text(answer, (X_PADDING + spaceBetweenCards + cardWidth + 5) + (firstLineWidth + 3) + 3, current_y + 8)

                doc.setTextColor('#ffffff')

                //description
                doc.setFontSize(8).setFont(undefined, 'normal');
                let adviceDesc = "";
                const oneLineLength = 44;
                for (let i = 0; i <= oneLineLength * 5; i += oneLineLength) {
                    adviceDesc += (advice.description.substr(i, oneLineLength).trim() + "\n");
                }

                if (adviceDesc.length > (oneLineLength * 5) - 3) {
                    adviceDesc = adviceDesc.substr(0, ((oneLineLength * 5) - 3)) + "...";
                }
                doc.setFontSize(7).setFont(undefined, 'normal');
                doc.setTextColor('#919EAB')
                doc.text(adviceDesc, (X_PADDING + spaceBetweenCards + cardWidth) + 5, current_y + (noOfLines === 2 ? 18 : 15));

                doc.setTextColor('#ffffff')


                // En saviour Text
                doc.setFontSize(7).setFont(undefined, 'bold');
                doc.setTextColor('#0373ff')
                doc.text("En savoir plus", (X_PADDING + spaceBetweenCards + cardWidth) + 5, current_y + 35)
                doc.setTextColor('#ffffff')

                //Setting Data
            }
            if (index === 1) {
                current_y += 40;
            }
        })
    }
}

const measureFirstLineWidth = (doc, text, maxWidth, fontSize) => {

    const lines = doc.splitTextToSize(text, maxWidth);
    const firstLine = lines[0];
    const firstLineWidth = doc.getStringUnitWidth(firstLine) * fontSize / doc.internal.scaleFactor;

    // Return the measured width of the first line
    return firstLineWidth;
}

const addHeader = async (doc, current_y) => {
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 0; i <= pageCount; i++) {
        // const img = new Image()
        // img.src = './PDF/Logo-hermes.png'
        // doc.addImage(img, 'PNG', 12, 11, 39.54545454545455
        //     , 10);
        const { imgStr: logoString, width: logoWidth, height: logoHeight }: any = await imgToBase64('./PDF/Logo-hermes.png')
        doc.addImage(logoString as string ?? '', 'PNG', 12, current_y, logoWidth / 22, logoHeight / 22)
        doc.setFontSize(8)
        doc.text("Rendez-vous sur", X_PADDING + 133, current_y + 6);
        doc.setTextColor('#F25929')
        doc.setFont('transDucer', 'italic');
        doc.textWithLink("HERMES", X_PADDING_RIGHT, current_y + 6, { url: 'https://hermes-15b29.web.app/', align: "right" });
        doc.setTextColor('#212B36')
        doc.setFont('transDucer', 'normal');
    }
}
const addFooters = async (doc, current_y) => {
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setFontSize(8)
        doc.setPage(i)
        doc.setFillColor('#023A80');
        doc.rect(0, current_y, 210, 18, 'F');
        const img = new Image()
        img.src = './PDF/email.png'
        const imgphone = new Image()
        imgphone.src = './PDF/phones.png'
        const imgfooter = new Image()
        imgfooter.src = './PDF/Group.png'
        doc.addImage(imgfooter, 'PNG', 12, current_y + 4, 9, 9);
        doc.setTextColor('#ffffff')
        doc.setFontSize(14)
        doc.text("hermes", 24, current_y + 10);
        doc.setTextColor('#ffffff')
        doc.setFontSize(8)
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'italic');
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'normal');
        doc.addImage(img, 'PNG', 175, current_y + 7, 5, 5);
        doc.textWithLink("HERMES", 182, current_y + 10, { url: 'https://hermes-15b29.web.app/' });
        // doc.text("hermes.fr", 182, 291);
        doc.setTextColor('#ffffff')
        doc.setFont('transDucer', 'normal');
    }
}
const imgToBase64 = (imgPath: string) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imgPath;
        img.onload = function () {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0, img.width, img.height);
            const base64String = canvas.toDataURL('image/png');
            resolve({
                imgStr: base64String, width: img.width, height: img.height
            })
        };

        img.onerror = function (error) {
            reject(error);
        };
    });
}

const currentDateFrench = () => {
    const frenchMonthNames = {
        1: "janvier",
        2: "février",
        3: "mars",
        4: "avril",
        5: "mai",
        6: "juin",
        7: "juillet",
        8: "août",
        9: "septembre",
        10: "octobre",
        11: "novembre",
        12: "décembre"
    };

    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const dateString = `${day} ${frenchMonthNames[month]} ${year}`;
    return dateString;
}