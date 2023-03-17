"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSubmit = exports.handleClick = void 0;
function handleClick() { }
exports.handleClick = handleClick;
- > None;
console.log('Button clicked!');
const api_penguin_1 = __importDefault(require("./api.penguin"));
name = '';
email = '';
phone = '';
result = '';
- > None;
setState({ 'name': text });
- > None;
setState({ 'email': text });
- > None;
setState({ 'phone': text });
function handleSubmit() { }
exports.handleSubmit = handleSubmit;
- > None;
user = {
    'name': state.name,
    'email': state.email,
    'phone': state.phone,
};
created_user = api_penguin_1.default.create_user(user);
setState({ 'result': f, "User created: {created_user['name']}":  });
