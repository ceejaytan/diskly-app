# GameCDRental_FasAPI


##### Requirments:
- Python 3.13
- pip 25.2

```
How to run on Windows:
# change directory first
$: cd BackEnd/  

# Create the virtual environment  
$: python -m venv .venv

# Activate it (PowerShell)
$: .venv\Scripts\Activate.ps1

# Or, if using Command Prompt (cmd.exe)
$: .venv\Scripts\activate.bat

# Install requirements
$: pip install -r requirements.txt

# start server
$: uvicorn code:Main:app --port 8080

# Make sure frontend svelte is running on port 5173
```


 ## things still needed to add  

### 1. User Management  
- [ ] Sign up (Create Account, username, password, contact,...)  
- [x] Log in  (Authentication, Validate Cookie Session)  
- [ ] Profile Management  (view/update user info, view rental history, current rentals)  
### 2. Admin Dashboard  
- [ ] View All rentals  
- [ ] Add new stocks  
- [ ] Update stocks  
- [ ] Delete stocks  
- [ ] Track Rentals  
- [ ] Rental Summary (frequent users, most rented, )
- [ ] Due date warning  
### 3. Game Catalog  
- [ ] User browsing  
- [ ] Filter Game Catalog  
- [ ] Fuzzy search Catalog
### 4. Rental System
- [ ] Rent Game ()
- [ ] Return Game ()
