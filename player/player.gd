extends CharacterBody2D

var velocidade = 200

func _physics_process(delta):

	var direcao = Vector2.ZERO

	if Input.is_action_pressed("move_right"):
		direcao.x += 1

	if Input.is_action_pressed("move_left"):
		direcao.x -= 1

	if Input.is_action_pressed("move_down"):
		direcao.y += 1

	if Input.is_action_pressed("move_up"):
		direcao.y -= 1

	velocity = direcao.normalized() * velocidade

	move_and_slide()
