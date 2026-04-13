document.addEventListener('DOMContentLoaded', () => {
    const salaryInput = document.getElementById('salary');
    const dependentsInput = document.getElementById('dependents');
    const educationInput = document.getElementById('education');
    const mortgageInput = document.getElementById('mortgage');
    const calcBtn = document.getElementById('calc-btn');
    const totalRefundEl = document.getElementById('total-refund');
    const breakdownEl = document.getElementById('breakdown');

    function formatSom(value) {
        return Math.round(value).toLocaleString('ru-RU');
    }

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
        const monthlyBase = monthlySalary - socialInsurance - personalDeduction - dependentsDeduction;
        const monthlyTax = Math.max(0, monthlyBase * 0.10);

        // 3. Annual Totals
        const annualBase = monthlyBase * 12;
        const annualTaxPaid = monthlyTax * 12;

        // 4. Social Deduction (Education)
        // Limit: 10% of base, or 25% if 3+ dependents
        const socialLimitRate = dependents >= 3 ? 0.25 : 0.10;
        const maxSocialDeduction = annualBase * socialLimitRate;
        const appliedSocialDeduction = Math.min(educationYear, maxSocialDeduction);
        
        // 5. Property Deduction (Mortgage)
        // Total limit mentioned in article is 230,000 som
        const appliedPropertyDeduction = Math.min(mortgageYear, 230000);

        // 6. Final Calculation
        const newBase = Math.max(0, annualBase - appliedSocialDeduction - appliedPropertyDeduction);
        const newTax = newBase * 0.10;
        const totalRefund = Math.max(0, annualTaxPaid - newTax);

        // Update UI
        totalRefundEl.innerHTML = `${formatSom(totalRefund)} <span>СОМ</span>`;
        
        let breakdownHtml = `
            <p>Годовая налоговая база: <strong>${formatSom(annualBase)} сомов</strong></p>
            <p>Уплачено налогов за год: <strong>${formatSom(annualTaxPaid)} сомов</strong></p>
            <hr style="margin: 1rem 0; opacity: 0.1">
        `;

        if (appliedSocialDeduction > 0) {
            const socialRefund = appliedSocialDeduction * 0.10;
            breakdownHtml += `<p>Возврат за обучение: +${formatSom(socialRefund)} сомов</p>`;
        }
        if (appliedPropertyDeduction > 0) {
            const propertyRefund = appliedPropertyDeduction * 0.10;
            breakdownHtml += `<p>Возврат по ипотеке: +${formatSom(propertyRefund)} сомов</p>`;
        }

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

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
