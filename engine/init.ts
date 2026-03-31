// Import all simulation modules to trigger their self-registration
import './modules/supply-demand';
import './modules/elasticity';
import './modules/keynesian-multiplier';
import './modules/phillips-curve';
import './modules/is-lm';
import './modules/ad-as';
import './modules/kaldor-square';
import './modules/laffer-curve';
import './modules/lorenz-gini';
import './modules/money-creation';

export { getModule, getAllModules, getModuleSlugs } from './core/registry';
