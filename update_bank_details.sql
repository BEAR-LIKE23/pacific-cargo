-- Update the single settings row with the new bank details
update app_settings
set 
  bank_name = 'OPAY',
  account_number = '8147398327',
  account_name = 'MICHAEL MAYOWA OGUNSAKIN',
  updated_at = now();
