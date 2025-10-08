export default function Rental_form(){

  return(
  <>
      <div className="rental-form-container">
        <form>

          <div className="Rental-form-game-title">
            {/* Takes an entire space width */}
            <label>Game Title</label>
            <input type="text"/>
          </div>

          <div className="Rental-form-date"> 
            {/* this input should be in the format of DD/MM/YYYY */}
            {/* It also should be styled side to side */}
            <label>Rental Start Date</label>
            <input />

            <label>Return Date</label>
            <input />
          </div>

          <div className="Rental-form-date"> 
            {/* All three input is in one row side to side with Quantity being the smallest width */}
            <label>Console</label>
            <input type="text" />
            
            <label>Quantity</label>
            <input type="number"/>

            <label>Total</label>
            <input type="number"/>
          </div>
        </form>
      </div>

  </>
  )
}
