const validatePayment = (payment) => {
  try {
    if (!payment.Employee || !payment.Payor || !payment.Payee || !payment.Amount) {
      return false;
    }
    const employees = payment.Employee;
    for (const employee of employees) {
      if (!employee.DunkinId || !employee.DunkinBranch || !employee.FirstName || !employee.LastName || !employee.DOB || !employee.PhoneNumber) {
        return false;
      }
    }
    const payors = payment.Payor;
    for (const payor of payors) {
      if (!payor.DunkinId || !payor.ABARouting || !payor.AccountNumber || !payor.Name || !payor.DBA || !payor.EIN || !payor.Address) {
        return false;
      }
      const address = payor.Address[0];
      if (!address.Line1 || !address.City || !address.State || !address.Zip) {
        return false;
      }
    }
    const payees = payment.Payee;
    for (const payee of payees) {
      if (!payee.PlaidId || !payee.LoanAccountNumber) {
        return false;
      }
    }
    if (!payment.Amount[0] || !payment.Amount[0].match(/^\$\d+(\.\d{2})?$/)) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { validatePayment }
