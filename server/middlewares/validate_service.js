const validatePayment = (payment) => {
  try {
    if (!payment.Employee || !payment.Payor || !payment.Payee || !payment.Amount) {
      return false;
    }

    // Validate Employee data
    const employee = payment.Employee;
    if (!employee.DunkinId || !employee.DunkinBranch ||
      !employee.FirstName || !employee.LastName || !employee.DOB ||
      !employee.PhoneNumber) {
      return false;
    }

    // Validate Payor data
    const payor = payment.Payor;
    if (!payor.DunkinId || !payor.ABARouting ||
        !payor.AccountNumber || !payor.Name || !payor.EIN ||
        !payor.Address) {
      return false;
    }
    const address = payor.Address;
    if (!address.Line1 || !address.City || !address.State || !address.Zip) {
      return false;
    }

    // Validate Payee data
    const payee = payment.Payee;
    if (!payee.PlaidId || !payee.LoanAccountNumber) {
      return false;
    }

    // Validate Amount data
    const amountRegex = /^\$\d+(\.\d{2})?$/;
    if (!amountRegex.test(payment.Amount)) {
          return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { validatePayment }
