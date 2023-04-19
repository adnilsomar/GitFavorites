export class GitHubUser {
  static search(username){
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({login, name, public_repos, followers}) => ({
      login,
      name,
      public_repos,
      followers
    }))
  }
}


export class favorites{
  constructor(root){
    this.root = document.querySelector(root)
    this.load()
    this.onadd()
    
  }

  load(){
    this.entries = JSON.parse(localStorage.getItem
    ('@github-favorites:')) || []
    
  }

  save(){
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username){
    try{

      const userExist = this.entries.find(entry => entry.login === username)

      if(userExist){
        throw new Error('Usuário já cadastrado')
      }
      
      const user = await GitHubUser.search(username)

      if(user.login === undefined){
        throw new Error('Usuario não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user){
    const filteredEntries = this.entries.filter(entry => 
      entry.login !== user.login)

     this.entries = filteredEntries
     this.update()
     this.save()
     
    }
}


export class FavoritesView extends favorites {
  constructor(root){
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
    

  
  }

  onadd() {

    const addButton = this.root.querySelector('.search button')
    addButton.onclick = () => {
      const input = this.root.querySelector('.search input')
      const {value} = input;

      this.add(value)

      input.value = ''; 

    }
  }

  update(){
   /*  this.removeAllTr() */
    this.verify()
  
    this.entries.forEach(user => {
    const row = this.createRow()

    row.querySelector('.user img').src = `https://github.com/${user.login}.png`
    row.querySelector('.user img').alt = `image de ${user.login}`
    row.querySelector('.user a').href = `https://github.com/${user.login}`
    row.querySelector('.user p').textContent= user.name
    row.querySelector('.user span').textContent= `/${user.login}`
    row.querySelector('.repositories').textContent=user.public_repos
    row.querySelector('.followers').textContent = user.followers

    row.querySelector('.remove').onclick = () =>{

      const isOk = confirm('Tem certeza que quer deletar essa linha')
      if(isOk){
        this.delete(user)
      }
    }

    this.tbody.append(row)
  })


  }

  createRow() {
    const tr= document.createElement('tr')

    tr.innerHTML= `
    <td class="user">
      <img src="https://github.com/adnilsomar.png" alt="">
      <a href="https://github.com/adnilsomar" target="_blank">
        <p>Linda Ramos</p>
        <span>adnilsomar</span>
      </a>
    </td>
    <td class="repositories">
      13
    </td>
    <td class="followers">
      0
    </td>
    <td>
      <button class="remove">Remover</button>
    </td>
    `
    return tr
  }

  createRowV() {
    const trV= document.createElement('tr')

    trV.innerHTML= `
    <td colspan="4">
    <div class="star2">
    
    <div><img src="image/Estrela.svg" alt=""></div>
    <p>Nenhum favorito ainda</p>
    
    </div>
    
    </td>
    `
    return trV
   
  }

  verify(){
    if(this.entries.length === 0){
      this.removeAllTr()
      this.addAlltr()

    }else{
      this.removeAllTr() 
    }
  }
  
  removeAllTr(){

      this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
  
          tr.remove()
        })
  }

  addAlltr(){
  
    const nullRow = this.createRowV()
      this.tbody.append(nullRow)
      return
  }
}


