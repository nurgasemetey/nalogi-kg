document.addEventListener('DOMContentLoaded', () => {
    const salaryInput = document.getElementById('salary');
    const dependentsInput = document.getElementById('dependents');
    const educationInput = document.getElementById('education');
    const mortgageInput = document.getElementById('mortgage');
    const calcBtn = document.getElementById('calc-btn');
    const totalRefundEl = document.getElementById('total-refund');
    const breakdownEl = document.getElementById('breakdown');
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    let activeTab = 'standard';

    function formatSom(value) {
        return Math.round(value).toLocaleString('ru-RU');
    }

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            activeTab = btn.dataset.tab;
            document.getElementById(activeTab).classList.add('active');
            
            calculate();
        });
    });

    function calculate() {
        const monthlySalary = parseFloat(salaryInput.value) || 0;
        const dependents = parseInt(dependentsInput.value) || 0;
        const educationYear = parseFloat(educationInput.value) || 0;
        const mortgageYear = parseFloat(mortgageInput.value) || 0;

        // 1. Standard monthly deductions
        const socialInsurance = monthlySalary * 0.10;
        const personalDeduction = 650;
        const dependentsDeduction = dependents * 100;

        // 2. Monthly Tax Base
        const monthlyBase = Math.max(0, monthlySalary - socialInsurance - personalDeduction - dependentsDeduction);
        const monthlyTax = monthlyBase * 0.10;

        // 3. Annual Totals
        const annualBase = monthlyBase * 12;
        const annualTaxPaid = monthlyTax * 12;

        // 4. Social Deduction (Education)
        const socialLimitRate = dependents >= 3 ? 0.25 : 0.10;
        const maxSocialDeduction = annualBase * socialLimitRate;
        const appliedSocialDeduction = Math.min(educationYear, maxSocialDeduction);
        
        // 5. Property Deduction (Mortgage)
        const appliedPropertyDeduction = Math.min(mortgageYear, 230000);

        // 6. Calculations based on active tab
        let displayRefund = 0;
        let breakdownHtml = '';

        if (activeTab === 'standard') {
            displayRefund = monthlyTax;
            totalRefundEl.previousElementSibling.textContent = 'Ваш подоходный налог в месяц:';
            totalRefundEl.querySelector('span').textContent = 'СОМ / МЕС';
            
            breakdownHtml = `
                <p>База для налога: <strong>${formatSom(monthlyBase)} сомов</strong></p>
                <p>Налог (10%): <strong>${formatSom(monthlyTax)} сомов</strong></p>
                <hr style="margin: 1rem 0; opacity: 0.1">
                <p>Вы экономите <strong>${formatSom((personalDeduction + dependentsDeduction) * 0.10)} сомов</strong> налога каждый месяц благодаря стандартным вычетам.</p>
            `;
        } else if (activeTab === 'social') {
            const refund = appliedSocialDeduction * 0.10;
            displayRefund = refund;
            totalRefundEl.previousElementSibling.textContent = 'Возврат за обучение (в год):';
            totalRefundEl.querySelector('span').textContent = 'СОМ';
            
            breakdownHtml = `
                <p>Уплачено налогов за год: <strong>${formatSom(annualTaxPaid)} сомов</strong></p>
                <p>Допустимый вычет (лимит): <strong>${formatSom(maxSocialDeduction)} сомов</strong></p>
                <hr style="margin: 1rem 0; opacity: 0.1">
                <p>Вы получите назад 10% от суммы обучения: <strong>${formatSom(refund)} сомов</strong></p>
            `;
        } else if (activeTab === 'property') {
            const refund = appliedPropertyDeduction * 0.10;
            displayRefund = refund;
            totalRefundEl.previousElementSibling.textContent = 'Возврат по ипотеке (в год):';
            totalRefundEl.querySelector('span').textContent = 'СОМ';
            
            breakdownHtml = `
                <p>Уплачено налогов за год: <strong>${formatSom(annualTaxPaid)} сомов</strong></p>
                <p>Макс. сумма процентов: <strong>230 000 сомов</strong></p>
                <hr style="margin: 1rem 0; opacity: 0.1">
                <p>Вы получите назад 10% от процентов: <strong>${formatSom(refund)} сомов</strong></p>
            `;
        }

        // Update UI
        totalRefundEl.childNodes[0].textContent = formatSom(displayRefund) + ' ';
        breakdownEl.innerHTML = breakdownHtml;

        // Animation effect
        totalRefundEl.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalRefundEl.style.transform = 'scale(1)';
        }, 200);
    }

    calcBtn.addEventListener('click', calculate);
    
    // Initial calculation
    calculate();

    // Mobile Menu Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
