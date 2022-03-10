import './style.css'
import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'
import { DirectionalLightHelper } from 'three'





// THREE JS 
/**
 * Debug
 */
// const gui = new dat.GUI()

if(window.innerWidth < 1){

  const parameters = {
    materialColor: '#ffeded'
  }
  
  // gui
  //     .addColor(parameters, 'materialColor')
  //     .onChange(() =>
  //     {
    //         material.color.set(parameters.materialColor)
    //         particlesMaterial.color.set(parameters.materialColor)
    //         for(let i=0;i<elems.length;i++){
      //           elems[i].style.color = parameters.materialColor + ' !important'
      //         }
      //     })
      
      /**
       * Base
       */
      // Canvas
      const canvas = document.querySelector('canvas.webgl')
      
      // Scene
      const scene = new THREE.Scene()
      
      /**
       * Objects
       */
      // Texture
      
      
      const textureLoader = new THREE.TextureLoader()
      const starTexture = textureLoader.load('singlestar.png')
      const gradientTexture = textureLoader.load()
      gradientTexture.magFilter = THREE.NearestFilter
      
      // Material
      const material = new THREE.MeshToonMaterial({
        color: parameters.materialColor,
      })
      
      // Objects
      const objectsDistance = 4
      const mesh1 = new THREE.Mesh(
        new THREE.TorusGeometry(0.05, 0.25, 100, 200),
        material
        )
        const mesh2 = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.4, 32),
          material
          )
          
          const mesh3 = new THREE.Mesh(
            new THREE.TorusKnotGeometry(0.1, 0.08, 300, 20,2,4),
            material
            )
            
            
            mesh1.position.x = -2.5
            mesh2.position.x = -1
            mesh3.position.x = 1
            
            mesh1.position.y = 1.5
            mesh2.position.y = - objectsDistance * 1.75
            mesh3.position.y = - objectsDistance * 1.75 
            
            scene.add(mesh1, mesh2, mesh3)
            
            const sectionMeshes = [ mesh1, mesh2, mesh3 ]
            
            /**
             * Lights
             */
            const directionalLight = new THREE.DirectionalLight('#ffffff', 1)
            directionalLight.position.set(1, 1, 0)
            scene.add(directionalLight)
            
            /**
             * Particles
             */
            // Geometry
            const particlesCount = 200
            const positions = new Float32Array(particlesCount * 3)
            
            for(let i = 0; i < particlesCount; i++)
            {
              positions[i * 3 + 0] = (Math.random() - 0.5) * 10
              positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
              positions[i * 3 + 2] = (Math.random() - 0.5) * 10
            }
            
            const particlesGeometry = new THREE.BufferGeometry()
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            
            // Material
            const particlesMaterial = new THREE.PointsMaterial({
              color: parameters.materialColor,
              sizeAttenuation: textureLoader,
              size: 0.08,
              map: starTexture,
              transparent: true,
            })
            
            // Points
            const particles = new THREE.Points(particlesGeometry, particlesMaterial)
            scene.add(particles)
            
            
            
            // Raindrops
            
            const rainGeometry = new THREE.BufferGeometry()
            const count = 200
            
            const vertices = new Float32Array(count * 3)
            
            for(let i = 0; i < count * 3; i++ ){
              
              vertices[i] = (Math.random()-0.5)*5
            }
            
            rainGeometry.setAttribute(
              'position',
              new THREE.BufferAttribute(vertices,3)
              )
              
              const p = rainGeometry.attributes.position.array
              
              const rainMaterial = new THREE.PointsMaterial()
              rainMaterial.size= 0.013
              rainMaterial.sizeAttenuation = true
              rainMaterial.transparent = true
              rainMaterial.color= new THREE.Color(0xffffff)
              rainMaterial.depthTest = false
              rainMaterial.depthWrite = false
              
              const rain = new THREE.Points(rainGeometry, rainMaterial)
              rain.position.y = -objectsDistance * 2.5
              scene.add(rain)
              
              
              
              /**
               * Sizes
               */
              const sizes = {
                width: window.innerWidth,
                height: window.innerHeight
              }

              window.addEventListener('resize', () =>
              {
                // Update sizes
                sizes.width = window.innerWidth
                sizes.height = window.innerHeight
                
                // Update camera
                camera.aspect = sizes.width / sizes.height
                camera.updateProjectionMatrix()
                
                // Update renderer
                renderer.setSize(sizes.width, sizes.height)
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
              })
              
              /**
               * Camera
 */
// Group
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () =>
{
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)
  
  if(newSection != currentSection)
  {
    currentSection = newSection
    
    gsap.to(
      sectionMeshes[currentSection].rotation,
      {
        duration: 1.5,
        ease: 'power2.inOut',
        x: '+=6',
        y: '+=3',
        z: '+=1.5'
      }
      )
    }
  })
  
  /**
   * Cursor
   */
  const cursor = {}
  cursor.x = 0
  cursor.y = 0
  
  window.addEventListener('mousemove', (event) =>
  {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
  })
  
  /**
   * Animate
   */
  const clock = new THREE.Clock()
  let previousTime = 0
  
  const tick = () =>
  {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    
    // Animate camera
    camera.position.y = - scrollY / sizes.height * objectsDistance
    
    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime
    
    // Animate meshes
    for(const mesh of sectionMeshes)
    {
      mesh.rotation.x += deltaTime * 0.1
      mesh.rotation.y += deltaTime * 0.12
    }
    
    for ( let i = 1; i <= (count * 3); i = i+3 ) {
      p[i] =p[i] - 0.03
      if(p[i] < -2){
        p[i] = 2.5
      }
    }
    rainGeometry.attributes.position.needsUpdate = true;
    
    // Render
    renderer.render(scene, camera)
    
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()


}
// JS


const months = ['January', 'February', 'March', 'April', 'May', 'June', 'Juli', 'August', 'September', 'October', 'November', 'December']
const weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function getTime(){
  window.addEventListener('load', () => {
    const today = new Date();
    let minutes = today.getMinutes()
    if(minutes < 10){
      minutes = '0'+minutes
    }
    const time = today.getHours() + ":" + minutes
    const month = today.getMonth()
    const weekday = today.getDay() % 7
    let day = today.getDay()
    if(day < 10){
      day = '0'+ day
    }
    document.getElementById('time').textContent = time
    document.getElementById('date').textContent =weekdays[weekday] + ', '+day + '. ' + months[month]
  })
}

getTime()

function navbarShow(){
  window.addEventListener('load', () => {
    const navbar = document.getElementById('navbar')
    const body = document.getElementsByTagName('body')[0]
    document.addEventListener('scroll', () => {
      if(scrollY > window.innerHeight){
        navbar.style.display = 'inline'
      }else{
        navbar.style.display = 'none'
      }
    })
  })
}

navbarShow()


function scrollUp(){
  window.addEventListener('load', () => {
    document.getElementById('up-button').addEventListener('click', () => {
      window.scrollTo({
        top: 0, behavior: 'smooth'
      })
    })  
  })
}
scrollUp()


function moveButton(){
  window.addEventListener('load', () => {
    const btn = document.getElementById('detect')
    document.addEventListener('mousemove', (e) => {
      const x = -e.clientX * 0.02 +2
      const y = e.clientY * 0.02 +2
      const coor = x +  ", y= " +y
      btn.innerHTML = coor;
      btn.style.transform = 'perspective(2000px) rotateX('+x+'deg) rotateY('+y+'deg)'
    })
  })
}

// moveButton()