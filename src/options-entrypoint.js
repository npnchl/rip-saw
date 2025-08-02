import { mount } from 'svelte';
import Options from './Options.svelte';

const optionsPage = mount(Options, {
    target: document.getElementById('options-mount'),
});

export default optionsPage;