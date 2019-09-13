const Div = createElement('div');
const Button = createElement('button');
const Article = createElement('article');
const Header = createElement('header');
const Main = createElement('main');
const Footer = createElement('footer');
const H4 = createElement('h4');
const Form = createElement('form');
const Input = createElement('input');

const DispatchForm = (children, options, dispatch, ...args) =>
    Form(children, {
        ...options,
        onsubmit: (e) => {
            dispatch.apply(this, args.concat(extractFormData(e.target.elements)));
            e.preventDefault();
        }
    });

const extractFormData = (elements) =>
    Array.from(elements)
        .filter(e => !!e.name)
        .map(e => ({ [e.name]: e.value }))
        .reduce((ac, e) => ({ ...ac, ...e }));

function render(content) {
    const container = document.getElementById('container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    container.append(content);
}

function createElement(tagName) {
    return function (children, options) {
        const el = document.createElement(tagName);
        for (const prop in options) {
            if (!options.hasOwnProperty(prop)) continue;
            if (prop.toLowerCase().startsWith('on')) {
                el.addEventListener(prop.substr(2), options[prop]);
            } else {
                el.setAttribute(prop, options[prop]);
            }
        }
        children.forEach(c => {
            if (typeof c === 'string') el.append(c);
            else el.append(c);
        });
        return el;
    };
}