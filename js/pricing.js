import { escape, icon, pageHeader } from './ui.js';

export const plans = [
  {
    id: 'free', name: 'Free', price: 0,
    description: 'Start building a regular study habit.',
    features: ['Basic vocabulary', 'Basic grammar exercises', 'Limited daily challenges', 'Basic progress tracking'],
  },
  {
    id: 'premium', name: 'Premium', price: 4.99,
    description: 'Go deeper with structured exam preparation.',
    features: ['Full vocabulary library', 'Advanced grammar exercises', 'More IELTS practice', 'More SAT practice', 'Detailed learning analytics', 'Personalized learning plans'],
  },
  {
    id: 'pro', name: 'Pro', price: 9.99,
    description: 'Build a more comprehensive study routine.',
    features: ['Everything in Premium', 'Additional practice materials', 'Advanced progress reports', 'Extended learning resources'],
  },
];

const symbols = { free: 'book', premium: 'sparkle', pro: 'layers' };
const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

function price(plan) {
  return plan.price ? currency.format(plan.price) : '$0';
}

function features(plan) {
  return `<ul class="plan-feature-list">
    ${plan.features.map((feature) => `<li>${icon('check', 16)}<span>${escape(feature)}</span></li>`).join('')}
  </ul>`;
}

function planCard(plan) {
  const free = plan.id === 'free';
  return `<article class="card learner-plan${plan.id === 'premium' ? ' featured-plan' : ''}" aria-labelledby="plan-${plan.id}">
    <div class="learner-plan-top">
      <span class="feature-icon${plan.id === 'pro' ? ' lilac' : ''}">${icon(symbols[plan.id])}</span>
      <span class="pill">${free ? 'Available now' : 'Planned'}</span>
    </div>
    <h2 id="plan-${plan.id}">${escape(plan.name)}</h2>
    <p class="muted">${escape(plan.description)}</p>
    <p class="learner-plan-price"><strong>${price(plan)}</strong><span class="muted"> / month</span></p>
    ${features(plan)}
    ${free ? `<a class="button secondary" href="dashboard.html">Open dashboard ${icon('arrow', 16)}</a>`
    : `<button class="button ${plan.id === 'premium' ? 'primary' : 'secondary'}" type="button" data-plan="${plan.id}">View ${escape(plan.name)} details ${icon('arrow', 16)}</button>`}
  </article>`;
}

export function render(root) {
  root.innerHTML = `${pageHeader('Pricing', 'Explore QORVIA’s free access and compare the planned paid tiers.')}
    <div class="card pricing-note">
      <span class="feature-icon">${icon('info')}</span>
      <div><strong>Free access is available today</strong><p class="muted">You can explore all current practice in the MVP. Paid plans and their prices are previews in USD.</p></div>
    </div>
    <section class="grid grid-3 learner-plans" aria-label="QORVIA plans">
      ${plans.map(planCard).join('')}
    </section>
    <dialog class="card plan-dialog" id="plan-dialog" aria-labelledby="plan-detail-title">
      <div id="plan-detail"></div>
      <form method="dialog"><button class="button secondary" autofocus>Back to pricing</button></form>
    </dialog>`;

  const dialog = root.querySelector('#plan-dialog');
  const content = root.querySelector('#plan-detail');
  for (const button of root.querySelectorAll('[data-plan]')) {
    button.addEventListener('click', () => {
      const plan = plans.find(({ id }) => id === button.dataset.plan);
      content.innerHTML = `<h2 id="plan-detail-title">${escape(plan.name)}</h2>
        <p class="learner-plan-price"><strong>${price(plan)}</strong><span class="muted"> / month</span></p>
        <p class="muted">${escape(plan.description)} Checkout will open when paid plans launch.</p>
        ${features(plan)}`;
      dialog.showModal();
    });
  }
}
