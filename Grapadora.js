 
class Grapadora extends THREE.Object3D {
  constructor() {
    super();

    this.createGUI();
    this.material = new THREE.MeshPhongMaterial( {color: 0xCF0000} );

    this.base = this.createBase();

    this.transf = new THREE.Object3D();
    // Se aplica la rotación (el giro de la parte móvil), y después se sitúa la pieza en su posición correcta encima de los pivotes.
    // IMPORTANTE: Con independencia del orden en el que se escriban las 2 líneas siguientes, SIEMPRE se aplica primero la rotación y después la traslación. Prueba a intercambiar las dos líneas siguientes y verás que no se produce ningún cambio al ejecutar.    
    this.transf.rotation.z = this.guiControls.rotacion;
    this.transf.position.set (0, this.guiControls.pedulo2_positiony, 2.5);
    // Al móvil se accede desde el método update. Se almacena en un atributo.
    var movil = this.createMovil();

    this.add(this.base);
    this.add(this.transf);
    this.transf.add(movil);

    //V a r i a b l e s   l o c a l e s   con   l o s   p a r á metros   y   v a l o r e s   a   u s a r
    var origen={x:0 ,y:0,z:0.5};
    var destino={x:0 ,y:0,z:-0.5};
    //    D e f i n i c i ón  de   l a   a n i m a c i ón :   V a r i a b l e s   o r i g e n ,   d e s t i n o   y   t i e m p o
    var movimiento = new TWEEN.Tween(origen)
    .to(destino,3000)//2 seg
    .yoyo(true)
    .repeat(Infinity);
    var that=this;
    movimiento.onUpdate(function(){
      that.guiControls.rotacion = this.z;
    });
    movimiento.start();
  }

  createBase(){
    var rectangulo = new THREE.BoxGeometry( 1,5,1 );//width,height
    var cube = new THREE.Mesh( rectangulo, this.material );

    cube.position.y = this.guiControls.pedulo1_positiony;

    var rombo1 = this.createRevolucion();
    // Se posicionan los pivotes con respecto a la base
    
    rombo1.position.set (0,-2.5, 1.3);//x,y,z
    rombo1.scale.set(0.4,0.4,0.4);
    rombo1.rotation.x=-1.5;

    cube.add(rombo1);

    return cube;
  }

  createRevolucion(){
    var points=[];
    points.push(new THREE.Vector2(0,0));
    points.push(new THREE.Vector2(1,1));
    points.push(new THREE.Vector2(0.4,1.8));
    points.push(new THREE.Vector2(0.3,2.7));
    points.push(new THREE.Vector2(0.9,3.1));
    points.push(new THREE.Vector2(1.3,3.4));
    points.push(new THREE.Vector2(1.25,4.1));
    points.push(new THREE.Vector2(0.9,4.1));
    points.push(new THREE.Vector2(0,4.1));
    
    var objeto = new THREE.LatheGeometry(points);
    var material = new THREE.MeshBasicMaterial( {color: 0x04B431} );
    var mesh = new THREE.Mesh( objeto.applyMatrix (new THREE.Matrix4().makeTranslation (0, -2, 0)), material );

    var axis= THREE.AxisHelper();
    mesh.add(axis);
    return mesh;
  }

  createMovil () {
    // Se crea la parte móvil
    var movil = new THREE.Mesh (
        new THREE.BoxGeometry (1, 5, 1)
          // Aplicando las transformaciones de esta manera modificamos la figura con respecto a su sistema de referencia local. En este caso se está situando el sistema de referencia local sobre el punto de giro de la parte móvil.
          .applyMatrix (new THREE.Matrix4().makeTranslation (0, -2.5, 0)),
        this.material
    );

    var axis= THREE.AxisHelper();
    movil.add(axis);
    
    return movil;
  }
  
  createGUI() {
    // Controles para el movimiento de la parte móvil
    this.guiControls = new function () {
      this.rotacion = 0;
      this.pedulo1_positiony = 0;
      this.pedulo2_positiony = -1;
      this.rotacionInferior = 0;
      this.altura = 1;
    } 
    
    // Se crea una sección para los controles de la caja
    var folder = gui.addFolder ('Controles del pendulo inferior');
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add (this.guiControls, 'rotacionInferior', -2, 2, 0.001).name ('Rotacion pendulo inferior : ');

    var folder = gui.addFolder ('Controles del pendulo superior');
    // Estas lineas son las que añaden los componentes de la interfaz
    // Las tres cifras indican un valor mínimo, un máximo y el incremento
    folder.add (this.guiControls, 'altura', 1, 1.5, 0.001).name ('Altura pendulo superior : ');
  }

  update () {
    // Se actualiza el nodo  this.movil  con el valor de la variable rotacion de la GUI
    this.rotation.z = this.guiControls.rotacion;
    this.transf.rotation.z = this.guiControls.rotacionInferior;
    this.base.position.y = this.guiControls.pedulo1_positiony-(this.guiControls.altura*2+this.guiControls.altura/2);
    this.base.scale.y = this.guiControls.altura;
    this.transf.position.y = this.guiControls.pedulo2_positiony-(this.guiControls.altura*4);
    
    //this.transf.scale.y = this.guiControls.altura;
    
  }
}